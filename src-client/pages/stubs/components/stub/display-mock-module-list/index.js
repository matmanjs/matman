import React from 'react';
import { Table, Button } from 'antd';

import './index.less';

export default function StubMockModuleList(props) {
  const { isLoaded, stubData, onShowResult, updateActive } = props;

  const activeModule = stubData.activeModule || '';
  const mockModuleList = stubData.modules || [];

  const tableColumns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <Button type="primary"
              disabled={stubData.disable ? 'disable' : ''}
              onClick={onShowResult.bind(this, record.query, record.host)}
      >
        {text}
      </Button>
    )
  }, {
    title: 'Description',
    dataIndex: 'description',
    key: 'description'
  }, {
      title: 'Author',
      dataIndex: 'author',
      key: 'author'
  }];

  return (
    <div className="stub-mock-module-list">

      < Table loading={!isLoaded} rowKey="name" columns={tableColumns} dataSource={mockModuleList} />

    </div>
  );
}
