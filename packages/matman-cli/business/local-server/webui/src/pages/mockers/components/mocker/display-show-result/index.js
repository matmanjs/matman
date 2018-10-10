import React, { Component } from 'react';
import { Button, Modal } from 'antd';

import './index.less';

export default class MockerShowResult extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showData: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState({
        showData: JSON.stringify(nextProps.data, null, 2)
      });
    }
  }

  handleOnChange = (event) => {
    this.setState({
      showData: event.target.value
    });
  };

  render() {
    const { data, mockerItem, onHide, onEmitPush } = this.props;
    const { showData } = this.state;

    const isShow = !!data;
    const isShowEmitButton = (mockerItem.config.plugin === 'async');

    return (
      <div className="mocker-show-result">

        <Modal
          title="结果"
          visible={isShow}
          onCancel={onHide}
          onOk={onHide}
          footer={[
            isShowEmitButton ? <Button key="push" type="primary" size="large" onClick={onEmitPush.bind(this, showData)}>
              主动推送
            </Button> : null,
            <Button key="cancel" type="primary" size="large" onClick={onHide}>
              知道了
            </Button>
          ]}
        >

                <textarea
                  name="cgidata"
                  id="cgidata"
                  style={{ width: '100%', minHeight: '600px' }}
                  value={showData}
                  onChange={this.handleOnChange}
                />

        </Modal>

      </div>
    );
  }

}