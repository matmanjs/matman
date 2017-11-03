import React from 'react';
import { Alert } from 'antd';

import './index.less';

export default function StubSwitcher() {
  return (
    <div className="stub-switcher">
      <Alert
        message="使用说明"
        description="点击列表中按钮会弹出对应的打桩数据，在对话框中选择【执行打桩操作】。（可以修改数据之后再执行，但是该修改后的数据不会保存，关闭对话框后会恢复）"
        type="info"
      />
    </div>
  );
}
