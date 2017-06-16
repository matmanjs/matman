import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';

import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './store/configureStore';
import routes from './routes';
import Root from './containers/Root';

import './index.less';

// ===================================================================
// 1. 创建 store
// ===================================================================
const store = configureStore(window.__initialState);

// ===================================================================
// 2. 创建 history
// ===================================================================
const history = syncHistoryWithStore(browserHistory, store);

// ===================================================================
// 3. ReactDOM 渲染
// ===================================================================
ReactDOM.render(
  <Root store={store} history={history} routes={routes} />,
  document.getElementById('root')
);
