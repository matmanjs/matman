import { CALL_API } from 'root/middleware/api';

export const STUB_REQUEST = 'STUB_REQUEST';
export const STUB_REQUEST_SUCCESS = 'STUB_REQUEST_SUCCESS';
export const STUB_REQUEST_FAIL = 'STUB_REQUEST_FAIL';

export const STUB_README_REQUEST = 'STUB_README_REQUEST';
export const STUB_README_REQUEST_SUCCESS = 'STUB_README_REQUEST_SUCCESS';
export const STUB_README_REQUEST_FAIL = 'STUB_README_REQUEST_FAIL';

export const SET_ACTIVE_MODULE_REQUEST = 'SET_ACTIVE_MODULE_REQUEST';
export const SET_ACTIVE_MODULE_REQUEST_SUCCESS = 'SET_ACTIVE_MODULE_REQUEST_SUCCESS';
export const SET_ACTIVE_MODULE_REQUEST_FAIL = 'SET_ACTIVE_MODULE_REQUEST_FAIL';

function fetchStub(stubName) {
  return {
    [CALL_API]: {
      types: [STUB_REQUEST, STUB_REQUEST_SUCCESS, STUB_REQUEST_FAIL],
      url: `/sys-cgi/stub/${stubName}`,
    },
  }
}

export function loadStub(stubName) {
  return (dispatch, getState) => {
    return dispatch(fetchStub(stubName));
  };
}

function fetchStubReadme(stubName) {
  return {
    [CALL_API]: {
      types: [STUB_README_REQUEST, STUB_README_REQUEST_SUCCESS, STUB_README_REQUEST_FAIL],
      url: `/sys-cgi/stub/${stubName}/readme`,
    },
  }
}

export function loadStubReadme(stubName) {
  return (dispatch, getState) => {
    return dispatch(fetchStubReadme(stubName));
  };
}

function requestUpdateStub(stubName, newStubState) {
  return {
    [CALL_API]: {
      types: [SET_ACTIVE_MODULE_REQUEST, SET_ACTIVE_MODULE_REQUEST_SUCCESS, SET_ACTIVE_MODULE_REQUEST_FAIL],
      url: `/sys-cgi/stub/${stubName}`,
      type: 'POST',
      data: newStubState
    },
  }
}

export function setStubActiveModule(stubName, stubModuleName) {
  return (dispatch, getState) => {
    return dispatch(requestUpdateStub(stubName, {
      activeModule: stubModuleName,
    }));
  };
}

export function setStubDisable(stubName, value) {
  return (dispatch, getState) => {
    return dispatch(requestUpdateStub(stubName, {
      disable: value,
    }));
  };
}