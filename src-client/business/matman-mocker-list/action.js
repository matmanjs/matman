import { CALL_API } from 'root/middleware/api';

export const RESOURCE_REQUEST = 'RESOURCE_REQUEST';
export const RESOURCE_REQUEST_SUCCESS = 'RESOURCE_REQUEST_SUCCESS';
export const RESOURCE_REQUEST_FAIL = 'RESOURCE_REQUEST_FAIL';
//
// function fetchResource(resourceId) {
//   return {
//     [CALL_API]: {
//       types: [RESOURCE_REQUEST, RESOURCE_REQUEST_SUCCESS, RESOURCE_REQUEST_FAIL],
//       url: '/cgi-bin/channel/qq_offical_account',
//       type: 'get',
//       data: {
//         id: resourceId,
//       },
//     },
//   }
// }
//
// export function loadResource(resourceId = RESOURCE_ID) {
//   return (dispatch, getState) => {
//     return dispatch(fetchResource(resourceId));
//   }
// }
