import React from 'react';
import { Row, Col, Card, Button, Input } from 'antd';

import './index.less';

export default function ReporterDetail(props) {
  const { reporterData, actualURL, onShowResult, onParamsChange } = props;

  let curUrl = actualURL;

  // 获得当前激活状态的那个 mock module
  let mockModuleList = reporterData.modules || [],
    mockModuleData;

  for (let i = 0, length = mockModuleList.length; i < length; i++) {
    let curMockModule = mockModuleList[i];

    if (curMockModule.name === reporterData.activeModule) {
      if (curMockModule.host) {
        curUrl = `http://${curMockModule.host}${curUrl}`;
      }

      mockModuleData = curMockModule;
      break;
    }
  }

  return (
    <div className="reporter-detail">
      <Row>
        <Col span={12}>
          <Card>

            <Button
              type="primary"
              disabled={reporterData.disable ? 'disable' : ''}
              size="large"
              icon="link"
              onClick={onShowResult.bind(this, mockModuleData.query, mockModuleData.host)}>

              {reporterData.method} : {curUrl}

            </Button>


            <div>
              {
                reporterData.params && reporterData.params.length ? (
                  reporterData.params.map((item, index) => {
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

            <h2>{reporterData.name}</h2>
            <p>
              {reporterData.version ? `v${reporterData.version}` : ''}
              {reporterData.author ? ` by ${reporterData.author}` : ''}
            </p>
            <p>{reporterData.description}</p>
            <p>本地路径：{reporterData._fullPath}</p>
            <p>配置的路由: {reporterData.route}</p>
          </Card>
        </Col>

        <Col span={12}>
          <Card>
            <textarea
              style={{ width: '100%', minHeight: '200px' }}
              value={JSON.stringify(reporterData, null, 2)}
              readOnly
            />
          </Card>
        </Col>
      </Row>

    </div>
  );
}
