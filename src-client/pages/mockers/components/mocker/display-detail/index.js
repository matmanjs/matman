import React from 'react';
import { Card, Button, Input } from 'antd';

import './index.less';

export default function MockerDetail(props) {
  const { mockerData, curUrl } = props;

  return (
    <div className="mocker-detail">
      <Card>
        <h2>{mockerData.name} - {mockerData.version} - {mockerData.author} - {mockerData.description}</h2>

        <p>route: {mockerData.route}</p>

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

        <p>本地路径：{mockerData._fullPath}</p>
      </Card>
    </div>
  );
}
