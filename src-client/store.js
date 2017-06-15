import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';

import Api from 'root/middleware/api';
import Logger from 'root/middleware/logger';

import mockerListInfo from './business/matman-mocker-list/reducer';

export default createStore(
  combineReducers({
    mockerListInfo
  }),
  window.__initialState,
  applyMiddleware(thunkMiddleware, Api, Logger)
)
