import React from 'react';
import { Card } from 'antd';

import './index.less';

export default function MockerReadme(props) {
  const { htmlContent } = props;

  if (!htmlContent) {
    return null;
  }

  return (
    <div className="mocker-readme">
      <Card title="使用说明">
        <div className="readme-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </Card>
    </div>
  );
}
