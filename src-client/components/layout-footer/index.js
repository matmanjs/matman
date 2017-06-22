import React, {Component} from 'react';

import './index.less';

class LayoutFooter extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className="layout-footer">
        matman 版权所有
      </div>
    );
  }
}

export default LayoutFooter;