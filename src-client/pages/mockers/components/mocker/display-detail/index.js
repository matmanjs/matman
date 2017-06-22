import React from 'react';
import { Row, Col, Card, Button, Input } from 'antd';

import './index.less';

export default function MockerDetail(props) {
  const { mockerData, curUrl } = props;

  return (
    <div className="mocker-detail">
      <Row>
        <Col span={24}>
          <h2>{mockerData.name}</h2>
          <p>
            {mockerData.version ? `v${mockerData.version}` : ''}
            {mockerData.author ? ` by ${mockerData.author}` : ''}
          </p>
          <p>{mockerData.description}</p>
          <p>本地路径：{mockerData._fullPath}</p>
          <p>配置的路由: {mockerData.route}</p>
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <Card>
            <div>
              {
                mockerData.params && mockerData.params.length ? (
                  mockerData.params.map((item, index) => {
                    return <div key={index}>
                      {item.name}:
                      <Input placeholder={item.name}
                             defaultValue={item.defaultValue}
                             onChange={props.onParamsChange.bind(this, item.name)}
                      />
                    </div>
                  })
                ) : null
              }

              <Button type="primary" size="large" onClick={props.onShowResult.bind(this, {})}>
                {mockerData.method} : {curUrl}
              </Button>
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card>
            <textarea
              style={{ width: '100%', minHeight: '200px' }}
              value={JSON.stringify(mockerData, null, 2)}
              readOnly
            />
          </Card>
        </Col>
      </Row>

    </div>
  );
}
