import React from 'react';
import { Card } from 'antd';

import './index.less';

export default function ReporterReadme(props) {
  const { htmlContent } = props;

  if (!htmlContent) {
    return null;
  }

  return (
    <div className="reporter-readme">
      <Card title="使用说明">
        <div id="readme-content" className="readme-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </Card>
    </div>
  );
}
