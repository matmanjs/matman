import React from 'react';
import { Row, Col, Card, Button, Input } from 'antd';

import './index.less';

export default function MockerDetail(props) {
  const { mockerData, actualURL, onShowResult, onParamsChange } = props;

  let curUrl = actualURL;

  // 获得当前激活状态的那个 mock module
  let mockModuleList = mockerData.modules || [],
    mockModuleData;

  for (let i = 0, length = mockModuleList.length; i < length; i++) {
    let curMockModule = mockModuleList[i];

    if (curMockModule.name === mockerData.activeModule) {
      if (curMockModule.host) {
        curUrl = `http://${curMockModule.host}${curUrl}`;
      }

      mockModuleData = curMockModule;
      break;
    }
  }

  return (
    <div className="mocker-detail">
      <Row>
        <Col span={12}>
          <Card>

            <Button
              type={mockerData.disable ? 'default' : 'primary'}
              disabled={mockerData.disable ? 'disable' : ''}
              size="large"
              icon="link"
              onClick={onShowResult.bind(this, mockModuleData.query, mockModuleData.host)}>

              {mockerData.method} : {curUrl}

            </Button>


            <div>
              {
                mockerData.params && mockerData.params.length ? (
                  mockerData.params.map((item, index) => {
                    return <div key={index}>
                      {item.name}:
                      <Input placeholder={item.name}
                             defaultValue={item.defaultValue}
                             onChange={onParamsChange.bind(this, item.name)}
                      />
                    </div>
                  })
                ) : null
              }
            </div>

            <h2>{mockerData.name}</h2>
            <p>
              {mockerData.version ? `v${mockerData.version}` : ''}
              {mockerData.author ? ` by ${mockerData.author}` : ''}
            </p>
            <p>{mockerData.description}</p>
            <p>本地路径：{mockerData._fullPath}</p>
            <p>配置的路由: {mockerData.route}</p>
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
