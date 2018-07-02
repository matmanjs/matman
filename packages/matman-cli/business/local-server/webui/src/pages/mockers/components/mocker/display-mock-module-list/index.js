import React from 'react';
import { Button, Table } from 'antd';

import './index.less';

export default function MockerMockModuleList(props) {
    const { isLoaded, mockerItem, previewResult, updateActive } = props;

    const activeModule = mockerItem.config.activeModule || '';
    const mockModuleList = mockerItem.mockModuleList || [];

    const tableColumns = [{
        title: '数据模型名称',
        dataIndex: 'name',
        key: 'name'
    }, {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        render: (text, record) => (
            <div>
                {record.config.version ? 'V' + record.config.version : ''}
                {record.config.author ? ' by' + record.config.author : ''}
                {record.config.description}
            </div>
        )
    }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <div>
                <Button
                    type="primary"
                    disabled={mockerItem.config.disable ? 'disable' : ''}
                    onClick={previewResult.bind(this, record.config.query)}
                >
                    预览结果
                </Button>

                <span className="ant-divider" />

                {
                    (record.name !== activeModule) ?
                        <Button
                            type="primary"
                            disabled={mockerItem.config.disable ? 'disable' : ''}
                            onClick={updateActive.bind(this, record.name)}
                        >
                            激活
                        </Button>
                        : <Button
                            type="primary"
                            disabled={'disable'}
                        >
                            已激活
                        </Button>
                }
            </div>
        )
    }];

    return (
        <div className="mock-module-list">

            < Table loading={!isLoaded} rowKey="name" columns={tableColumns} dataSource={mockModuleList} />

        </div>
    );
}
