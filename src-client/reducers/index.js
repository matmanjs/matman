import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import sidebarInfo from '../business/matman-sidebar/reducer';

import mockerInfo from '../pages/mockers/business/mocker/reducer';
import mockerListInfo from '../pages/mockers/business/mocker-list/reducer';

import reporterInfo from '../pages/reporters/business/reporter/reducer';
import reporterListInfo from '../pages/reporters/business/reporter-list/reducer';

const rootReducer = combineReducers({
  routing, // 用于路由控制
  sidebarInfo,
  mockerInfo,
  mockerListInfo,
  reporterInfo,
  reporterListInfo,
});

export default rootReducer
