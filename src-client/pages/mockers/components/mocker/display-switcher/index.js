import React from 'react';
import { Button } from 'antd';

import './index.less';

export default function MockerSwitcher(props) {
  const { isDisabled, updateDisable } = props;

  return (
    <div className="mocker-switcher">

      <h2>当前 mock 服务{isDisabled ? '禁用' : '启用'}中</h2>

      <Button type="primary" size="large" onClick={updateDisable}>
        {isDisabled ? '启用' : '禁用'} mock 服务
      </Button>

    </div>
  );
}
