import React from 'react';
import { Table, Button } from 'antd';

import './index.less';

export default function MockerMockModuleList(props) {
  const { isLoaded, mockerData, onShowResult, updateActive } = props;

  const activeModule = mockerData.activeModule || '';
  const mockModuleList = mockerData.modules || [];

  const tableColumns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <Button type="primary" size="large" onClick={onShowResult.bind(this, record.query)}>
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
              <a href="javascript:;" onClick={updateActive.bind(this, record.name)}>Active It</a>
              : <span>Aready active</span>
          }

        <span className="ant-divider" />
          <a href="#">Edit</a>

          <span className="ant-divider" />
          <a href="#">Delete</a>
        </span>
    ),
  }];

  return (
    <div className="mocker-mock-module-list">

      < Table loading={!isLoaded} rowKey="name" columns={tableColumns} dataSource={mockModuleList} />

    </div>
  );
}
