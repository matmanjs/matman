import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';

import PageContainer from './App';

import store from './store';

import './index.css';

export default function init(callback) {
  // connect
  const Root = connect(function (state) {
    return state;
  })(PageContainer);

  // try react render
  try {
    ReactDOM.render(
      <Provider store={store}>
        <Root />
      </Provider>,
      document.getElementById('root')
    );

    callback(true);
  } catch (err) {
    callback(false, err);
  }
}

// 初始化
init((isSuccess, err) => {
  if (isSuccess) {
    console.log('ReactDOM success');
  } else {
    console.error('ReactDOM err', err);
  }
});