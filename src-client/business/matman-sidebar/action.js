import { SIDEBAR_MENU_DATA } from './index';

export const SIDEBAR_COLLAPSE = 'SIDEBAR_COLLAPSE';
export const SIDEBAR_NO_COLLAPSE = 'SIDEBAR_NO_COLLAPSE';
export const LOAD_MENU_SUCCESS = 'LOAD_MENU_SUCCESS';

export function collapseSidebar() {
  return {
    type: SIDEBAR_COLLAPSE
  }
}

export function unCollapseSidebar() {
  return {
    type: SIDEBAR_NO_COLLAPSE
  }
}

export function loadMenu() {
  return {
    type: LOAD_MENU_SUCCESS,
    data: SIDEBAR_MENU_DATA
  }
}
