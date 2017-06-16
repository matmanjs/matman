import React, { PropTypes } from 'react';
import { Provider, connect } from 'react-redux';
import { Router } from 'react-router';

const Root = ({ store, history, routes }) => (
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired
};

export default connect(function (state) {
  return state;
})(Root);
