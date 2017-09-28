import { CALL_API } from 'root/middleware/api';

export const REPORTER_REQUEST = 'REPORTER_REQUEST';
export const REPORTER_REQUEST_SUCCESS = 'REPORTER_REQUEST_SUCCESS';
export const REPORTER_REQUEST_FAIL = 'REPORTER_REQUEST_FAIL';

export const REPORTER_README_REQUEST = 'REPORTER_README_REQUEST';
export const REPORTER_README_REQUEST_SUCCESS = 'REPORTER_README_REQUEST_SUCCESS';
export const REPORTER_README_REQUEST_FAIL = 'REPORTER_README_REQUEST_FAIL';

export const REPORTER_SET_ACTIVE_MODULE_REQUEST = 'REPORTER_SET_ACTIVE_MODULE_REQUEST';
export const REPORTER_SET_ACTIVE_MODULE_REQUEST_SUCCESS = 'REPORTER_SET_ACTIVE_MODULE_REQUEST_SUCCESS';
export const REPORTER_SET_ACTIVE_MODULE_REQUEST_FAIL = 'REPORTER_SET_ACTIVE_MODULE_REQUEST_FAIL';

function fetchReporter(reporterName) {
  return {
    [CALL_API]: {
      types: [REPORTER_REQUEST, REPORTER_REQUEST_SUCCESS, REPORTER_REQUEST_FAIL],
      url: `/sys-cgi/reporter/${reporterName}`,
    },
  }
}

export function loadReporter(reporterName) {
  return (dispatch, getState) => {
    return dispatch(fetchReporter(reporterName));
  };
}

function fetchReporterReadme(reporterName) {
  return {
    [CALL_API]: {
      types: [REPORTER_README_REQUEST, REPORTER_README_REQUEST_SUCCESS, REPORTER_README_REQUEST_FAIL],
      url: `/sys-cgi/reporter/${reporterName}/readme`,
    },
  }
}

export function loadReporterReadme(reporterName) {
  return (dispatch, getState) => {
    return dispatch(fetchReporterReadme(reporterName));
  };
}

function requestUpdateReporter(reporterName, newReporterState) {
  return {
    [CALL_API]: {
      types: [REPORTER_SET_ACTIVE_MODULE_REQUEST, REPORTER_SET_ACTIVE_MODULE_REQUEST_SUCCESS, REPORTER_SET_ACTIVE_MODULE_REQUEST_FAIL],
      url: `/sys-cgi/reporter/${reporterName}`,
      type: 'POST',
      data: newReporterState
    },
  }
}

export function setReporterActiveModule(reporterName, reportModuleName) {
  return (dispatch, getState) => {
    return dispatch(requestUpdateReporter(reporterName, {
      activeModule: reportModuleName,
    }));
  };
}

export function setReporterDisable(reporterName, value) {
  return (dispatch, getState) => {
    return dispatch(requestUpdateReporter(reporterName, {
      disable: value,
    }));
  };
}