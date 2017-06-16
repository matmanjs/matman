import {
  MOCKER_LIST_REQUEST,
  MOCKER_LIST_REQUEST_SUCCESS,
  MOCKER_LIST_REQUEST_FAIL
} from './action';

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
  }

  return Object.keys(update).length ? Object.assign({}, state, update) : state;
}

export default mockerListInfo;

