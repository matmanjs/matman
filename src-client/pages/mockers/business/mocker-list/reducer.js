import _ from 'lodash';

import {
  MOCKER_LIST_REQUEST,
  MOCKER_LIST_REQUEST_SUCCESS,
  MOCKER_LIST_REQUEST_FAIL,
} from './action';

import {
  SET_ACTIVE_MODULE_REQUEST_SUCCESS,
} from '../mocker/action';

const initialState = {
  isLoaded: false,
  list: [],
};

function mockerListInfo(state = initialState, action) {
  let { type, data } = action,
    update = {};

  switch (type) {
    case MOCKER_LIST_REQUEST_SUCCESS:
      update = {
        isLoaded: true,
        list: data
      };
      break;
    case MOCKER_LIST_REQUEST_FAIL:
      update = {
        isLoaded: true
      };
      break;

    case SET_ACTIVE_MODULE_REQUEST_SUCCESS:
      update.list = state.list.map((item) => {
        if (item.name === data.name) {
          item = _.merge({}, item, data);
        }
        return item;
      });
      break;
  }

  return Object.keys(update).length ? Object.assign({}, state, update) : state;
}

export default mockerListInfo;

