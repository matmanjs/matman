import React from 'react';
import { Modal, Button } from 'antd';

import './index.less';

export default function MockerShowResult(props) {
  const { isShow, data, onHide } = props;

  return (
    <div className="stub-show-result">

      <Modal
        title="结果"
        visible={isShow}
        onCancel={onHide}
        onOk={onHide}
        footer={[
          <Button key="submit" type="primary" size="large" onClick={onHide}>
            知道了
          </Button>,
        ]}
      >

        <textarea
          name="cgidata"
          id="cgidata"
          style={{ width: '100%', minHeight: '600px' }}
          value={JSON.stringify(data, null, 2)}
          readOnly
        />

      </Modal>

    </div>
  );
}
