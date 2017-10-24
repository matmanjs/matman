import _ from 'lodash';

import {
  STUB_REQUEST,
  STUB_REQUEST_SUCCESS,
  STUB_REQUEST_FAIL,
  STUB_README_REQUEST_SUCCESS,
  SET_ACTIVE_MODULE_REQUEST_SUCCESS,
} from './action';

const initialState = {
  isLoaded: false,
  data: {},
  readme: ''
};

function stubInfo(state = initialState, action) {
  let { type, data } = action,
    update = {};

  switch (type) {
    case STUB_REQUEST:
      update = {
        isLoaded: false
      };
      break;
    case STUB_REQUEST_SUCCESS:
      update = {
        isLoaded: true,
        data: _.merge({}, data, {
          modules: (data.modules || []).sort((a, b) => {
            return b.priority - a.priority
          })
        })
      };
      break;
    case STUB_REQUEST_FAIL:
      update = {
        isLoaded: true
      };
      break;

    case STUB_README_REQUEST_SUCCESS:
      update = {
        readme: data.html
      };
      break;

    case SET_ACTIVE_MODULE_REQUEST_SUCCESS:
      update.data = _.merge({}, state.data, data);
      break;
  }

  return Object.keys(update).length ? Object.assign({}, state, update) : state;
}

export default stubInfo;

