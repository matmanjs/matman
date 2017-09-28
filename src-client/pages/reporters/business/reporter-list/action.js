import { CALL_API } from 'root/middleware/api';

export const REPORTER_LIST_REQUEST = 'REPORTER_LIST_REQUEST';
export const REPORTER_LIST_REQUEST_SUCCESS = 'REPORTER_LIST_REQUEST_SUCCESS';
export const REPORTER_LIST_REQUEST_FAIL = 'REPORTER_LIST_REQUEST_FAIL';

function fetchReporterList() {
  return {
    [CALL_API]: {
      types: [REPORTER_LIST_REQUEST, REPORTER_LIST_REQUEST_SUCCESS, REPORTER_LIST_REQUEST_FAIL],
      url: '/sys-cgi/reporter'
    },
  }
}

export function loadReporterList() {
  return (dispatch, getState) => {
    return dispatch(fetchReporterList());
  };
}
