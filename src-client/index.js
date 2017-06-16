import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';

import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './store/configureStore';
import routes from './routes';
import Root from './containers/Root';

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

//
// import PageContainer from './App';
//
// import store from './store';
//
// import './index.css';
//
// export default function init(callback) {
//   // connect
//   const Root = connect(function (state) {
//     return state;
//   })(PageContainer);
//
//   // try react render
//   try {
//     ReactDOM.render(
//       <Provider store={store}>
//         <Root />
//       </Provider>,
//       document.getElementById('root')
//     );
//
//     callback(true);
//   } catch (err) {
//     callback(false, err);
//   }
// }
//
// // 初始化
// init((isSuccess, err) => {
//   if (isSuccess) {
//     console.log('ReactDOM success');
//   } else {
//     console.error('ReactDOM err', err);
//   }
// });