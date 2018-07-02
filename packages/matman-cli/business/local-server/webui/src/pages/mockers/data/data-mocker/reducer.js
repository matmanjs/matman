import _ from 'lodash';

import {
  MOCKER_README_REQUEST_SUCCESS,
  MOCKER_REQUEST,
  MOCKER_REQUEST_FAIL,
  MOCKER_REQUEST_SUCCESS,
  SET_ACTIVE_MODULE_REQUEST_SUCCESS
} from './action';

const initialState = {
  isLoaded: false,
  data: {},
  readme: ''
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
        data: _.merge({}, data, {
          modules: (data.modules || []).sort((a, b) => {
            return b.priority - a.priority;
          })
        })
      };
      break;
    case MOCKER_REQUEST_FAIL:
      update = {
        isLoaded: true
      };
      break;

    case MOCKER_README_REQUEST_SUCCESS:
      update = {
        readme: data.html
      };
      break;

    case SET_ACTIVE_MODULE_REQUEST_SUCCESS:
      update.data = _.merge({}, state.data, data);
      break;

    default:
      break;
  }

  return Object.keys(update).length ? Object.assign({}, state, update) : state;
}

export default mockerInfo;

