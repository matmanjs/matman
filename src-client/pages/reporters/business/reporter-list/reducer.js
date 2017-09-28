import _ from 'lodash';

import {
  REPORTER_LIST_REQUEST,
  REPORTER_LIST_REQUEST_SUCCESS,
  REPORTER_LIST_REQUEST_FAIL,
} from './action';

import {
  REPORTER_SET_ACTIVE_MODULE_REQUEST_SUCCESS,
} from '../reporter/action';

const initialState = {
  isLoaded: false,
  list: [],
};

function reporterListInfo(state = initialState, action) {
  let { type, data } = action,
    update = {};

  switch (type) {
    case REPORTER_LIST_REQUEST_SUCCESS:
      update = {
        isLoaded: true,
        list: (data || []).sort((a, b) => {
          return b.priority - a.priority
        })
      };
      break;
    case REPORTER_LIST_REQUEST_FAIL:
      update = {
        isLoaded: true
      };
      break;

    case REPORTER_SET_ACTIVE_MODULE_REQUEST_SUCCESS:
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

export default reporterListInfo;

