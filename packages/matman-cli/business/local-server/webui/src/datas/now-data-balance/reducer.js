import {
    RECOMMEND_REQUEST,
    RECOMMEND_REQUEST_SUCCESS,
    RECOMMEND_REQUEST_FAIL
} from './action';

/**
 * 此处数据结构可以参考 ./model-recommend-list.js
 * @type {Object}
 */
const initialState = {
    isLoaded: false,
    list: []
};

export default function recommendInfo(state = initialState, action) {
    let { data } = action,
        update = {};

    switch (action.type) {
        case RECOMMEND_REQUEST:
            break;
        case RECOMMEND_REQUEST_SUCCESS:
            update = {
                list: data,
                isLoaded: true
            };
            break;
        case RECOMMEND_REQUEST_FAIL:
            update = {
                isLoaded: true
            };
            break;
    }

    return Object.keys(update).length ? Object.assign({}, state, update) : state;
}

