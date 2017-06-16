import {SIDEBAR_COLLAPSE, SIDEBAR_NO_COLLAPSE, LOAD_MENU_SUCCESS} from './action';

const initialState = {
  collapse: false,
  menuData: {},
  menuDataMap: {}
};

export default function sidebarInfo(state = initialState, action) {
  switch (action.type) {
    case SIDEBAR_COLLAPSE:
      return Object.assign({}, state, {
        collapse: true
      });
    case SIDEBAR_NO_COLLAPSE:
      return Object.assign({}, state, {
        collapse: false
      });
    case LOAD_MENU_SUCCESS:
      return Object.assign({}, state, {
        menuData: action.data,
        menuDataMap: changeToMap(action.data)
      });
    default:
      return state;
  }
}

function changeToMap(data) {
  let map = {};

  const _getMenu = (curItem) => {
    if (curItem.children) {
      curItem.children.forEach((childItem) => {
        childItem.parent = curItem;
        _getMenu(childItem);
      });
    } else if (!curItem.hide) {
      map[curItem.id] = curItem;
    }
  };

  _getMenu(data);

  return map;
}