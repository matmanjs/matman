import React, { Component } from 'react';
import { connect } from 'react-redux';
import superagent from 'superagent';
import util from '../../../../business/util';

import { Table, Card, Modal, Button } from 'antd';

import { loadMocker, setMockerActiveModule } from '../../business/mocker/action';

class Mocker extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showModal: false,
      modalShowData: {},
    };

    this.handleActive = this.handleActive.bind(this);
    this.handleModalOk = this.handleModalOk.bind(this);
    this.handleShowResult = this.handleShowResult.bind(this);
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
    this.props.setMockerActiveModule(this.props.routeParams.mockerName, name);
  }

  handleModalOk() {
    this.setState({
      showModal: false,
      modalShowData: {},
    });
  }

  handleShowResult(query = {}) {
    const { mockerData } = this.props;
    console.log('mockerData', mockerData);

    if (mockerData.method === 'post') {
      this.getMockModuleByPost(mockerData.route, query)
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
      this.getMockModuleByGet(mockerData.route, query)
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

  render() {
    const { isLoaded, mockerData, route } = this.props;

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
              <Card>
                <h2>{mockerData.name} - {mockerData.version} - {mockerData.author} - {mockerData.description}</h2>
                <p>
                  <Button type="primary" size="large" onClick={this.handleShowResult.bind(this, {})}>
                    {mockerData.method} : {mockerData.route}
                  </Button>
                </p>
                <p>本地路径：{mockerData._fullPath}</p>
              </Card>

              < Table loading={!isLoaded} rowKey="name" columns={columns} dataSource={data} />

              <Modal
                title="结果"
                visible={this.state.showModal}
                footer={[
                  <Button key="submit" type="primary" size="large" onClick={this.handleModalOk}>
                    知道了
                  </Button>,
                ]}
              >
                  <textarea name="cgidata" id="cgidata" style={{ width: '100%', minHeight: '600px' }}
                            value={JSON.stringify(this.state.modalShowData, null, 2)} readOnly></textarea>
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
    mockerData: mockerInfo.data,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadMocker(mockerName){
      return dispatch(loadMocker(mockerName));
    },

    setMockerActiveModule(mockerName, mockModuleName){
      return dispatch(setMockerActiveModule(mockerName, mockModuleName));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Mocker);


