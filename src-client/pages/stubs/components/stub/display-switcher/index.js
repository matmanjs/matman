import React from 'react';
import { Button, Alert } from 'antd';

import './index.less';

export default function StubSwitcher(props) {
  const { isDisabled, updateDisable } = props;
  return (
    <div className="stub-switcher">
      <Alert
        message="使用说明"
        description="点击列表中按钮会弹出对应的打桩数据，在对话框中选择【执行打桩操作】。（可以修改数据之后再执行，但是该修改后的数据不会保存，关闭对话框后会恢复）"
        type="info"
      />

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
