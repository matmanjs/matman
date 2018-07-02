import { CALL_API } from '../../../../middlewares/api';

export const MOCKER_REQUEST = 'MOCKER_REQUEST';
export const MOCKER_REQUEST_SUCCESS = 'MOCKER_REQUEST_SUCCESS';
export const MOCKER_REQUEST_FAIL = 'MOCKER_REQUEST_FAIL';

export const MOCKER_README_REQUEST = 'MOCKER_README_REQUEST';
export const MOCKER_README_REQUEST_SUCCESS = 'MOCKER_README_REQUEST_SUCCESS';
export const MOCKER_README_REQUEST_FAIL = 'MOCKER_README_REQUEST_FAIL';

export const SET_ACTIVE_MODULE_REQUEST = 'SET_ACTIVE_MODULE_REQUEST';
export const SET_ACTIVE_MODULE_REQUEST_SUCCESS = 'SET_ACTIVE_MODULE_REQUEST_SUCCESS';
export const SET_ACTIVE_MODULE_REQUEST_FAIL = 'SET_ACTIVE_MODULE_REQUEST_FAIL';

function fetchMocker(mockerName) {
  return {
    [CALL_API]: {
      types: [MOCKER_REQUEST, MOCKER_REQUEST_SUCCESS, MOCKER_REQUEST_FAIL],
      url: `/matman-cgi/mocker/${mockerName}`
    }
  };
}

export function loadMocker(mockerName) {
  return (dispatch, getState) => {
    return dispatch(fetchMocker(mockerName));
  };
}

function fetchMockerReadme(mockerName) {
  return {
    [CALL_API]: {
      types: [MOCKER_README_REQUEST, MOCKER_README_REQUEST_SUCCESS, MOCKER_README_REQUEST_FAIL],
      url: `/matman-cgi/mocker/${mockerName}/readme`
    }
  };
}

export function loadMockerReadme(mockerName) {
  return (dispatch, getState) => {
    return dispatch(fetchMockerReadme(mockerName));
  };
}

function requestUpdateMocker(mockerName, newMockerState) {
  return {
    [CALL_API]: {
      types: [SET_ACTIVE_MODULE_REQUEST, SET_ACTIVE_MODULE_REQUEST_SUCCESS, SET_ACTIVE_MODULE_REQUEST_FAIL],
      url: `/matman-cgi/mocker/${mockerName}`,
      type: 'POST',
      data: newMockerState
    }
  };
}

export function setMockerActiveModule(mockerName, mockModuleName) {
  return (dispatch, getState) => {
    return dispatch(requestUpdateMocker(mockerName, {
      config: {
        activeModule: mockModuleName
      }
    }));
  };
}

export function setMockerDisable(mockerName, value) {
  return (dispatch, getState) => {
    return dispatch(requestUpdateMocker(mockerName, {
      config: {
        disable: value
      }
    }));
  };
}