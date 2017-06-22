import React, { Component } from 'react';
import { connect } from 'react-redux';
import superagent from 'superagent';

import { Table, Card, Modal, Button, Input } from 'antd';

import { loadMocker, setMockerActiveModule, setMockerDisable } from '../../business/mocker/action';

import MockerDetail from './display-detail';

class Mocker extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showModal: false,
      modalShowData: {},
      cgiParams: {},
      actualURL: ''
    };

    this.handleActive = this.handleActive.bind(this);
    this.handleModalHide = this.handleModalHide.bind(this);
    this.handleShowResult = this.handleShowResult.bind(this);
    this.handleParamsChange = this.handleParamsChange.bind(this);
    this.handleDisable = this.handleDisable.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoaded && (this.props.isLoaded !== nextProps.isLoaded)) {
      // 加载完 mocker 信息之后，要初始化填写的参数
      const { mockerData } = nextProps;
      let mockerParams = mockerData.params || [];
      let { cgiParams } = this.state;

      if (mockerParams.length) {
        mockerParams.forEach((item) => {
          if (item.defaultValue) {
            cgiParams[item.name] = item.defaultValue;
          }
        });

        this.setState({
          cgiParams: cgiParams,
          actualURL: this.getActualURL(mockerData, cgiParams)
        });
      }
    }
  }

  componentDidMount() {
    console.log('Mocker componentDidMount', this.props);

    this.fetch();
  }

  fetch() {
    this.props.loadMocker(this.props.routeParams.mockerName);
  }

  getMockModuleByPost(url, data) {
    return new Promise((resolve, reject) => {
      superagent.post(url)
        .set('Content-Type', 'application/json')
        .send(data)
        .withCredentials()
        .end((err, res) => {
          if (err) {
            return reject(err);
          }

          resolve(res.body);
        });
    });
  }

  getMockModuleByGet(url, data) {
    return new Promise((resolve, reject) => {
      superagent.get(url)
        .query(data)
        .withCredentials()
        .end((err, res) => {
          if (err) {
            return reject(err);
          }

          resolve(res.body);
        });
    });
  }

  handleActive(name) {
    this.props.setMockerActiveModule(this.props.mockerData.name, name);
  }

  handleModalHide() {
    this.setState({
      showModal: false,
      modalShowData: {},
    });
  }

  handleShowResult(query = {}) {
    const { mockerData } = this.props;
    const { actualURL } = this.state;

    console.log('mockerData', mockerData, actualURL);

    if (mockerData.method === 'post') {
      this.getMockModuleByPost(actualURL, query)
        .then((data) => {
          console.log(data);
          this.setState({
            showModal: true,
            modalShowData: data,
          })
        })
        .catch((err) => {
          console.error(err)
        });
    } else {
      this.getMockModuleByGet(actualURL, query)
        .then((data) => {
          console.log(data);
          this.setState({
            showModal: true,
            modalShowData: data,
          })
        })
        .catch((err) => {
          console.error(err)
        });
    }
  }

  handleParamsChange(fieldName, event) {
    let { mockerData } = this.props;
    let { cgiParams } = this.state;

    cgiParams[fieldName] = event.target.value;

    this.setState({
      cgiParams: cgiParams,
      actualURL: this.getActualURL(mockerData, cgiParams)
    });
  }

  handleDisable() {
    console.log('handleDisable', this.props.mockerData.disable);
    this.props.setMockerDisable(this.props.mockerData.name, !this.props.mockerData.disable);
  }

  getColumns() {
    const { mockerData } = this.props;
    const activeModule = mockerData.activeModule || '';

    return [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Button type="primary" size="large" onClick={this.handleShowResult.bind(this, record.query)}>
          {text}
        </Button>
      ),
    }, {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
    }, {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    }, {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          {
            (record.name !== activeModule) ?
              <a href="javascript:;" onClick={this.handleActive.bind(this, record.name)}>Active It</a>
              : <span>Aready active</span>
          }

          <span className="ant-divider" />
          <a href="#">Edit</a>

          <span className="ant-divider" />
          <a href="#">Delete</a>
        </span>
      ),
    }];
  }

  getActualURL(mockerData, cgiParams) {
    let curUrl = mockerData.route;

    if (Object.keys(cgiParams).length) {
      Object.keys(cgiParams).forEach((key) => {
        curUrl = curUrl.replace(':' + key, cgiParams[key]);
      })
    }

    console.log('curUrl', curUrl);
    return curUrl;
  }

  render() {
    const { isLoaded, mockerData, route } = this.props;
    const { showModal, modalShowData, actualURL } = this.state;

    const data = mockerData.modules;
    const columns = this.getColumns();

    return (
      <div>
        <h3>location</h3>
        <p>{JSON.stringify(location)}</p>
        <h3>route</h3>
        <p>{JSON.stringify(route)}</p>

        {
          isLoaded ? (
            <div>
              <h2>当前 mock 服务{mockerData.disable ? '禁用' : '启用'}中</h2>
              <Button type="primary" size="large" onClick={this.handleDisable}>
                {mockerData.disable ? '启用' : '禁用'} mock 服务
              </Button>

              <MockerDetail
                mockerData={mockerData}
                curUrl={actualURL}
                onParamsChange={this.handleParamsChange}
                onShowResult={this.handleShowResult}
              />

              < Table loading={!isLoaded} rowKey="name" columns={columns} dataSource={data} />

              <Modal
                title="结果"
                visible={showModal}
                onCancel={this.handleModalHide}
                onOk={this.handleModalHide}
                footer={[
                  <Button key="submit" type="primary" size="large" onClick={this.handleModalHide}>
                    知道了
                  </Button>,
                ]}
              >
                  <textarea name="cgidata" id="cgidata" style={{ width: '100%', minHeight: '600px' }}
                            value={JSON.stringify(modalShowData, null, 2)} readOnly></textarea>
              </Modal>
            </div>
          ) : null
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { mockerInfo } = state;

  return {
    isLoaded: mockerInfo.isLoaded,
    mockerData: mockerInfo.data
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadMocker(mockerName){
      return dispatch(loadMocker(mockerName));
    },

    setMockerActiveModule(mockerName, mockModuleName){
      return dispatch(setMockerActiveModule(mockerName, mockModuleName));
    },

    setMockerDisable(mockerName, value){
      return dispatch(setMockerDisable(mockerName, value));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Mocker);


