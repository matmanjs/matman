import React, { Component } from 'react';

import './index.less';

class LayoutHeader extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className="layout-header">
        <h2>欢迎使用 matman</h2>
      </div>
    );
  }
}

export default LayoutHeader;