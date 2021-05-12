import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './index.less';

export default class DisplayMessageTips extends Component {
  static create(opts) {
    if (!opts.dom) {
      opts.dom = document.createElement('div');
      opts.dom.id = `message-tips-${Date.now()}`;
      document.body.appendChild(opts.dom);
    }

    const { dom } = opts;

    ReactDOM.render(
      React.createElement(this, opts),
      dom
    );

    const remove = function () {
      if (dom) {
        ReactDOM.unmountComponentAtNode(dom);
        document.body.removeChild(dom);
      }
    };

    // 自动消失
    setTimeout(remove, opts.delay || 3000);

    return {
      remove,
    };
  }

  render() {
    const { isSuccess, msg } = this.props;

    return (
            <div className={'message-tips'}>
                <div className={`icon ${isSuccess ? 'icon-success' : 'icon-err'}`} />
                <p>{msg}</p>
            </div>
    );
  }
}
