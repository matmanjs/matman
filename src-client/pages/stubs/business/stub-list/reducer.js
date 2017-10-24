import _ from 'lodash';

import {
  STUB_LIST_REQUEST,
  STUB_LIST_REQUEST_SUCCESS,
  STUB_LIST_REQUEST_FAIL,
} from './action';

import {
  SET_ACTIVE_MODULE_REQUEST_SUCCESS,
} from '../stub/action';

const initialState = {
  isLoaded: false,
  list: [],
};

function stubListInfo(state = initialState, action) {
  let { type, data } = action,
    update = {};

  switch (type) {
    case STUB_LIST_REQUEST_SUCCESS:
      update = {
        isLoaded: true,
        list: (data || []).sort((a, b) => {
          return b.priority - a.priority
        })
      };
      break;
    case STUB_LIST_REQUEST_FAIL:
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

export default stubListInfo;

