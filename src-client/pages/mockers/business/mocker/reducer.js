import _ from 'lodash';

import {
  MOCKER_REQUEST,
  MOCKER_REQUEST_SUCCESS,
  MOCKER_REQUEST_FAIL,
  SET_ACTIVE_MODULE_REQUEST_SUCCESS,
} from './action';

const initialState = {
  isLoaded: false,
  data: {},
};

function mockerInfo(state = initialState, action) {
  let { type, data } = action,
    update = {};

  switch (type) {
    case MOCKER_REQUEST:
      update = {
        isLoaded: false
      };
      break;
    case MOCKER_REQUEST_SUCCESS:
      update = {
        isLoaded: true,
        data: data
      };
      break;
    case MOCKER_REQUEST_FAIL:
      update = {
        isLoaded: true
      };
      break;

    case SET_ACTIVE_MODULE_REQUEST_SUCCESS:
      update.data = _.merge({}, state.data, data);
      break;
  }

  return Object.keys(update).length ? Object.assign({}, state, update) : state;
}

export default mockerInfo;

