import { CALL_API } from '../../middlewares/api';

export const RECOMMEND_REQUEST = 'RECOMMEND_REQUEST';
export const RECOMMEND_REQUEST_SUCCESS = 'RECOMMEND_REQUEST_SUCCESS';
export const RECOMMEND_REQUEST_FAIL = 'RECOMMEND_REQUEST_FAIL';

function fetchRecommend(num, tabId, isFriendLabel) {
    return {
        [CALL_API]: {
            types: [RECOMMEND_REQUEST, RECOMMEND_REQUEST_SUCCESS, RECOMMEND_REQUEST_FAIL],
            url: `http://now.qq.com/cgi-bin/now/web/user/get_personal_live_rcmd_read`,
            type: 'get',
            data: {
                num: num,
                tab_id: tabId,
                friend_label: isFriendLabel
            }
        }
    };
}

export function loadRecommend(num, tabId, isFriendLabel) {
    return (dispatch, getState) => {
        return dispatch(fetchRecommend(20, 2, false));
    };
}
