import React from 'react';
import { Button, Alert } from 'antd';

import './index.less';

export default function StubSwitcher(props) {
  const { isDisabled, updateDisable } = props;

  return (
    <div className="stub-switcher">
      {
        isDisabled ? (
          <Alert
            message="当前打桩服务已被禁用，您可请点击“启用”按钮开始 mock 服务！"
            type="warning"
            showIcon
          />
        ) : (
          <Alert
            message="打桩服务已开始生效！"
            type="success"
            showIcon
          />
        )
      }

      <Button type={isDisabled ? 'primary' : 'default'} icon="setting" onClick={updateDisable}>
        {isDisabled ? '启用' : '禁用'}打桩服务
      </Button>

    </div>
  );
}
