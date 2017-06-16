import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import sidebarInfo from '../business/matman-sidebar/reducer';
import mockerListInfo from '../pages/mockers/business/mocker-list/reducer';

const rootReducer = combineReducers({
  routing, // 用于路由控制
  sidebarInfo,
  mockerListInfo
});

export default rootReducer
