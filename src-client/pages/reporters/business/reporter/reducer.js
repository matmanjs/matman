import _ from 'lodash';

import {
  REPORTER_REQUEST,
  REPORTER_REQUEST_SUCCESS,
  REPORTER_REQUEST_FAIL,
  REPORTER_README_REQUEST_SUCCESS,
  REPORTER_SET_ACTIVE_MODULE_REQUEST_SUCCESS,
} from './action';

const initialState = {
  isLoaded: false,
  data: {},
  readme: ''
};

function reporterInfo(state = initialState, action) {
  let { type, data } = action,
    update = {};

  switch (type) {
    case REPORTER_REQUEST:
      update = {
        isLoaded: false
      };
      break;
    case REPORTER_REQUEST_SUCCESS:
      update = {
        isLoaded: true,
        data: _.merge({}, data, {
          modules: (data.modules || []).sort((a, b) => {
            return b.priority - a.priority
          })
        })
      };
      break;
    case REPORTER_REQUEST_FAIL:
      update = {
        isLoaded: true
      };
      break;

    case REPORTER_README_REQUEST_SUCCESS:
      update = {
        readme: data.html
      };
      break;

    case REPORTER_SET_ACTIVE_MODULE_REQUEST_SUCCESS:
      update.data = _.merge({}, state.data, data);
      break;
  }

  return Object.keys(update).length ? Object.assign({}, state, update) : state;
}

export default reporterInfo;

