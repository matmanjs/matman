import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Table } from 'antd';

class Mocker extends Component {
  constructor(props, context) {
    super(props, context);

  }

  componentDidMount() {
    console.log('Mocker componentDidMount', this.props);
  }

  getColumns() {
    const activeModule = this.props.mockerData.operation.activeModule;

    return [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a href={record.cgi} target="_blank">{text}</a>
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
              <a href="#">Active It</a>
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
    const { mockerData, routeParams, route } = this.props;
    const mockerName = routeParams.mockerName;

    const data = mockerData.modules;
    const columns = this.getColumns();

    return (
      <div>
        <h3>location</h3>
        <p>{JSON.stringify(location)}</p>
        <h3>route</h3>
        <p>{JSON.stringify(route)}</p>

        <h3>Mocker</h3>
        <p>Hello, I am in {mockerName}</p>
        <Table rowKey="name" columns={columns} dataSource={data} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { mockerListInfo } = state;

  return {
    isLoaded: mockerListInfo.isLoaded,
    mockerData: {
      "version": "0.0.1",
      "description": "标准CGI返回，查询某个模块",
      "author": "helinjiang",
      "cgi": "/cgi-bin/a/b/simple_cgi",
      "operation": { "activeModule": "success_exist_matman" },
      "name": "simple_cgi",
      "fullPath": "D:\\gitprojects\\matman\\test\\demo\\src\\mocker\\simple_cgi",
      "modules": [{
        "description": "错误：未登录",
        "version": "0.0.1",
        "author": "helinjiang",
        "name": "error_not_login",
        "cgi": "/cgi-bin/a/b/simple_cgi?_m_target=error_not_login"
      }, {
        "description": "成功：存在matman模块",
        "version": "0.0.1",
        "author": "helinjiang",
        "name": "success_exist_matman",
        "cgi": "/cgi-bin/a/b/simple_cgi?_m_target=success_exist_matman"
      }, {
        "description": "成功：不存在该模块",
        "version": "0.0.1",
        "author": "helinjiang",
        "name": "success_not_exist",
        "cgi": "/cgi-bin/a/b/simple_cgi?_m_target=success_not_exist"
      }]
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Mocker);


