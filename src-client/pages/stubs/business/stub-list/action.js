import { CALL_API } from 'root/middleware/api';

export const STUB_LIST_REQUEST = 'STUB_LIST_REQUEST';
export const STUB_LIST_REQUEST_SUCCESS = 'STUB_LIST_REQUEST_SUCCESS';
export const STUB_LIST_REQUEST_FAIL = 'STUB_LIST_REQUEST_FAIL';

function fetchStubList() {
  return {
    [CALL_API]: {
      types: [STUB_LIST_REQUEST, STUB_LIST_REQUEST_SUCCESS, STUB_LIST_REQUEST_FAIL],
      url: '/sys-cgi/stub'
    },
  }
}

export function loadStubList() {
  return (dispatch, getState) => {
    return dispatch(fetchStubList());
  };
}
