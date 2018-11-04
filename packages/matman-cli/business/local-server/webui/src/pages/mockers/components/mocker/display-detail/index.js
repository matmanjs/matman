import React from 'react';
import { Card, Col, Row } from 'antd';

import './index.less';

export default function MockerDetail(props) {
    const { mockerItem } = props;

    // 获得当前激活状态的那个 mock module
    let mockModuleItem = (mockerItem.mockModuleList || []).filter((item) => {
        return item.name === mockerItem.config.activeModule;
    })[0];

    if (!mockModuleItem) {
        return null;
    }

    return (
        <Card className="mocker-detail">
            <Row>
                <Col span={12}>
                    <h2>{mockerItem.name}</h2>
                    <p>{mockerItem.config.description}</p>
                    <p>
                        {mockerItem.config.version ? `v${mockerItem.config.version}` : ''}
                        {mockerItem.config.author ? ` by ${mockerItem.config.author}` : ''}
                    </p>
                </Col>

                <Col span={12}>
                    <table>
                        <tbody>
                            <tr>
                              <td>数据类型:</td>
                              <td>{mockerItem.config.plugin}</td>
                            </tr>
                            <tr>
                                <td style={{ width: '100px' }}>配置的路由:</td>
                                <td>{mockerItem.config.route}</td>
                            </tr>
                            <tr>
                                <td>已激活数据:</td>
                                <td>{mockerItem.config.activeModule}</td>
                            </tr>
                        </tbody>
                    </table>
                </Col>
            </Row>
        </Card>
    );
}
