import React, { PureComponent } from 'react';

import './index.less';

export default class FormSubmit extends PureComponent {
  handleClick = () => {
    this.props.enter(this.props.isActive);
  };

  render() {
    const { isActive, text } = this.props;
    const css = `form-submit ${isActive ? 'active' : 'disable'}`;

    return (
      <div id="verify-btn" className={css} onClick={this.handleClick}>
        {text}
      </div>
    );
  }
}
