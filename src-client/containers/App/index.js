import './index.less';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import classnames from 'classnames';

import LayoutSidebar from '../../components/layout-sidebar';
import LayoutHeader from '../../components/layout-header';
import LayoutFooter from '../../components/layout-footer';

class App extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className={classnames({
        'matman-layout': true,
        'collapse': this.props.collapse
      })}>

        <LayoutSidebar />

        <div className="layout-main">

          <LayoutHeader />

          <div className="layout-container">
              {this.props.children}
          </div>

          <LayoutFooter />

        </div>
      </div>
    );

  }
}

const mapStateToProps = (state) => {
  const { sidebarInfo } = state;

  return {
    collapse: sidebarInfo.collapse,
  };
};

export default connect(mapStateToProps)(App);
