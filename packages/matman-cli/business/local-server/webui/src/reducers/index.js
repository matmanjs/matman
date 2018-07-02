import { combineReducers } from 'redux';

import { mockerInfo } from '../pages/mockers/data/data-mocker';
import { mockerListInfo } from '../pages/mockers/data/data-mocker-list';

const rootReducer = combineReducers({
    mockerInfo: mockerInfo,
    mockerListInfo: mockerListInfo
});

export default rootReducer;
