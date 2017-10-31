import React, { Component } from 'react';
import { Modal, Button } from 'antd';

import './index.less';

export default class StubShowResult extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      curMsg: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleEmitStub = this.handleEmitStub.bind(this);
  }

  componentDidMount() {
    this.setState({
      curMsg: JSON.stringify(this.props.data, null, 2)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState({
        curMsg: JSON.stringify(nextProps.data, null, 2)
      });
    }
  }

  handleChange(event) {
    console.log('==handleChange==', typeof event.target.value, event.target.value);
    this.setState({
      curMsg: event.target.value
    });
  }

  handleEmitStub() {
    this.props.onEmitStub(this.state.curMsg);
  }

  render() {
    const { curMsg } = this.state;
    const { isShow, onHide } = this.props;
    return (
      <div className="stub-show-result">

        <Modal
          title="结果"
          visible={isShow}
          onCancel={onHide}
          onOk={onHide}
          footer={[
            <Button key="stub" type="primary" size="large" onClick={this.handleEmitStub}>
              执行打桩操作
            </Button>,

            <Button key="cancel" size="large" onClick={onHide}>
              知道了
            </Button>
          ]}
        >

        <textarea
          style={{ width: '100%', minHeight: '600px' }}
          value={curMsg}
          onChange={this.handleChange}
        />

        </Modal>

      </div>
    );
  }
}