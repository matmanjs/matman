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
    this.handleClickMockModule = this.handleClickMockModule.bind(this);
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

  handleActive(name) {
    this.props.setMockerActiveModule(this.props.routeParams.mockerName, name);
  }

  handleModalOk() {
    this.setState({
      showModal: false,
      modalShowData: {},
    });
  }

  handleClickMockModule(mockModuleData, event) {
    const { mockerData } = this.props;
    console.log('mockerData', mockerData);

    // post 请求就不需要跳转了
    if (mockerData.method === 'post') {
      event.preventDefault();

      // let cgi = mockModuleData.cgi,
      //   urlObj = urlUtil.parse(cgi);

      this.getMockModuleByPost(mockerData.route, mockModuleData.query).then((data) => {
        console.log(data)
        this.setState({
          showModal: true,
          modalShowData: data,
        })
      }).catch((err) => {
        console.error(err)
      });
    }
  }

  getColumns() {
    const { mockerData } = this.props;
    const activeModule = mockerData.activeModule || '';

    const getUrl = (query) => {
      if (mockerData.method === 'post') {
        return mockerData.route;
      }

      return util.getUrl(mockerData.route, query);
    };

    return [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a href={getUrl(record.query)} target="_blank"
           onClick={this.handleClickMockModule.bind(this, record)}>{text}</a>
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


        <Card>
          <h2>{mockerData.name} - {mockerData.version} - {mockerData.author} - {mockerData.description}</h2>
          <p>{mockerData.method} : <a href={mockerData.route} target="_blank">{mockerData.route}</a></p>
          <p>本地路径：{mockerData._fullPath}</p>
        </Card>

        <Table loading={!isLoaded} rowKey="name" columns={columns} dataSource={data} />

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


