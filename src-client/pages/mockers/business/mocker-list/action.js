import { CALL_API } from 'root/middleware/api';

export const MOCKER_LIST_REQUEST = 'MOCKER_LIST_REQUEST';
export const MOCKER_LIST_REQUEST_SUCCESS = 'MOCKER_LIST_REQUEST_SUCCESS';
export const MOCKER_LIST_REQUEST_FAIL = 'MOCKER_LIST_REQUEST_FAIL';

export const SET_ACTIVE_MODULE_REQUEST = 'SET_ACTIVE_MODULE_REQUEST';
export const SET_ACTIVE_MODULE_REQUEST_SUCCESS = 'SET_ACTIVE_MODULE_REQUEST_SUCCESS';
export const SET_ACTIVE_MODULE_REQUEST_FAIL = 'SET_ACTIVE_MODULE_REQUEST_FAIL';

function fetchMockerList() {
  return {
    [CALL_API]: {
      types: [MOCKER_LIST_REQUEST, MOCKER_LIST_REQUEST_SUCCESS, MOCKER_LIST_REQUEST_FAIL],
      url: '/sys-cgi/mocker'
    },
  }
}

export function loadMockerList() {
  return (dispatch, getState) => {
    return dispatch(fetchMockerList());
  };
}

function requestSetMockerActiveModule(mockerName, mockModuleName) {
  return {
    [CALL_API]: {
      types: [SET_ACTIVE_MODULE_REQUEST, SET_ACTIVE_MODULE_REQUEST_SUCCESS, SET_ACTIVE_MODULE_REQUEST_FAIL],
      url: `/sys-cgi/mocker/${mockerName}`,
      type: 'POST',
      data: {
        activeModule: mockModuleName,
      }
    },
  }
}

export function setMockerActiveModule(mockerName, mockModuleName) {
  return (dispatch, getState) => {
    return dispatch(requestSetMockerActiveModule(mockerName, mockModuleName));
  };
}
