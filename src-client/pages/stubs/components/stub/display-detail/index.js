import React from 'react';
import { Row, Col, Card, Button, Input } from 'antd';

import './index.less';

export default function MockerDetail(props) {
  const { stubData, actualURL, onShowResult, onParamsChange } = props;

  let curUrl = actualURL;

  // 获得当前激活状态的那个 mock module
  let mockModuleList = stubData.modules || [],
    mockModuleData;

  for (let i = 0, length = mockModuleList.length; i < length; i++) {
    let curMockModule = mockModuleList[i];

    if (curMockModule.name === stubData.activeModule) {
      if (curMockModule.host) {
        curUrl = `http://${curMockModule.host}${curUrl}`;
      }

      mockModuleData = curMockModule;
      break;
    }
  }

  return (
    <div className="stub-detail">
      <Row>
        <Col span={12}>
          <Card>

            <Button
              type={stubData.disable ? 'default' : 'primary'}
              size="large"
              icon="link"
              onClick={onShowResult.bind(this, mockModuleData.query, mockModuleData.host)}>

              {stubData.method} : {curUrl}

            </Button>


            <div>
              {
                stubData.params && stubData.params.length ? (
                  stubData.params.map((item, index) => {
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

            <h2>{stubData.name}</h2>
            <p>
              {stubData.version ? `v${stubData.version}` : ''}
              {stubData.author ? ` by ${stubData.author}` : ''}
            </p>
            <p>{stubData.description}</p>
            <p>本地路径：{stubData._fullPath}</p>
            <p>配置的路由: {stubData.route}</p>
          </Card>
        </Col>

        <Col span={12}>
          <Card>
            <textarea
              style={{ width: '100%', minHeight: '200px' }}
              value={JSON.stringify(stubData, null, 2)}
              readOnly
            />
          </Card>
        </Col>
      </Row>

    </div>
  );
}
