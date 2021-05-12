import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './index.less';

export default class BaseDialog extends Component {
  static create(opts) {
    if (!opts.dom) {
      opts.dom = document.createElement('div');
      opts.dom.id = `now-dialog-wrapper-${Date.now()}`;
      document.body.appendChild(opts.dom);
    }

    const dom = opts.dom;

    ReactDOM.render(
      React.createElement(this, opts),
      dom
    );

    return {
      remove: function () {
        ReactDOM.unmountComponentAtNode(dom);
        document.body.removeChild(dom);
      }
    };
  }

  render() {
    const {
      skin,
      text,
      title,
      onEnter,
      onCancel,
      enterText,
      cancelText
    } = this.props;

    return (
      <div className={'dialog-wrapper ' + (skin || '')}>
        <div className="dialog-inner">
          <div className="dialog-text">
            {
              title ? (
                <div className="title">{title}</div>
              ) : null
            }
            {
              text ? (
                <div className="text">{text}</div>
              ) : null
            }
            {this.props.children}
          </div>
          <div className="dialog-buttons">
            {
              onCancel ? (
                <div className="dialog-btn cancel" onClick={onCancel}>{cancelText || '取消'}</div>
              ) : null
            }
            {
              onEnter ? (
                <div className="dialog-btn ok" onClick={onEnter}>{enterText || '确定'}</div>
              ) : null
            }
          </div>
        </div>
      </div>
    );
  }
}
