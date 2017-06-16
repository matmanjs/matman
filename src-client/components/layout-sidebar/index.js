import './index.less';

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux'

import classnames from 'classnames';

import { Menu, Icon } from 'antd';

import { collapseSidebar, unCollapseSidebar, loadMenu } from '../../business/matman-sidebar/action';

class LayoutSidebar extends Component {

  static propTypes = {
    menuData: PropTypes.object.isRequired,
    menuDataMap: PropTypes.object.isRequired,
    collapse: PropTypes.bool.isRequired,
    collapseSidebar: PropTypes.func.isRequired,
    unCollapseSidebar: PropTypes.func.isRequired,
    loadMenu: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: React.PropTypes.object
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      defaultSelectedKeys: [],
      defaultOpenKeys: [],
      needInitMenu: false
    };

    this.handleCollapseClick = this.handleCollapseClick.bind(this);
    this.handleSelectMenu = this.handleSelectMenu.bind(this);
  }

  componentDidMount() {
    // 加载菜单信息
    this.props.loadMenu();
  }

  componentWillReceiveProps(nextProps) {
    let { menuDataMap } = nextProps;

    // 关于菜单初始化，只需要一次即可
    if (!this.state.needInitMenu && Object.keys(menuDataMap).length) {
      let defaultSelectedKeys = this.getDefaultSelectedKeys(menuDataMap),
        defaultOpenKeys = this.getDefaultOpenKeys(menuDataMap, defaultSelectedKeys);

      this.setState({
        defaultSelectedKeys: defaultSelectedKeys,
        defaultOpenKeys: defaultOpenKeys,
        needInitMenu: true
      })
    }
  }

  /**
   * 判断路由是否是激活状态
   * @param {String} routeUrl 路由地址
   */
  isActive(routeUrl) {
    return this.context.router.isActive(routeUrl);
  }

  /**
   * 打开指定路由
   * @param {String} routeUrl 路由地址
   */
  open(routeUrl) {
    this.context.router.push(routeUrl);
  }

  /**
   * 获取菜单中默认选中的菜单对应的id数组
   * @param {Object} menuDataMap <id,menuOBJ>键值对
   * @return {Array}
   */
  getDefaultSelectedKeys(menuDataMap) {
    let arr = [];

    Object.keys(menuDataMap).forEach((id) => {
      let curMenu = menuDataMap[id];
      if (curMenu && this.isActive(curMenu.url)) {
        arr.push(id);
      }
    });

    return arr;
  }

  /**
   * 获取菜单中默认展开的菜单对应的id数组
   * @param {Object} menuDataMap <id,menuOBJ>键值对
   * @param {Array} selectedKeys 当前选中的菜单对应的id数组
   * @return {Array}
   */
  getDefaultOpenKeys(menuDataMap, selectedKeys) {
    let arr = [];

    const _getKeys = (id) => {
      let curItem = menuDataMap[id];

      if (curItem && curItem.parent && curItem.parent.id !== 'root') {
        arr.push(curItem.parent.id);

        if (curItem.parent.parent) {
          _getKeys(curItem.parent.id);
        }
      }
    };

    selectedKeys.forEach((id) => {
      _getKeys(id);
    });

    return arr;
  }

  /**
   * 处理菜单被选中时的事件
   *
   * https://ant.design/components/menu/
   *
   * @param {{ item:Object, key:String, selectedKeys:Array }} data 数据
   */
  handleSelectMenu(data) {
    let { menuDataMap } = this.props,
      selectedMenu = menuDataMap[data.key];

    if (selectedMenu && selectedMenu.url) {
      this.open(selectedMenu.url);
    }
  }

  /**
   * 处理菜单收起来或展开点击事件
   */
  handleCollapseClick() {
    if (this.props.collapse) {
      this.props.unCollapseSidebar();
    } else {
      this.props.collapseSidebar();
    }
  }

  /**
   * 渲染菜单
   * @param {Object} menuObj
   * @return {XML}
   */
  getRenderMenuItem(menuObj) {
    if (menuObj.children) {
      return (
        <Menu.SubMenu key={menuObj.id} title={<span><Icon type={menuObj.icon} />{menuObj.title}</span>}>
          {
            menuObj.children.map((item) => {
              return this.getRenderMenuItem(item)
            })
          }
        </Menu.SubMenu>
      )
    } else if (!menuObj.hide) {
      return (
        <Menu.Item key={menuObj.id}>
          <Icon type={menuObj.icon} />
          <span className="nav-text">{menuObj.title}</span>
        </Menu.Item>
      )
    }
  }

  render() {
    const { collapse, menuData } = this.props,
      { defaultSelectedKeys, defaultOpenKeys, needInitMenu } = this.state,
      isShowMenu = needInitMenu && menuData && Object.keys(menuData).length;

    return (
      <aside className={classnames({
        'layout-siderbar': true,
        'collapse': collapse
      })}>

        <div className="siderbar-logo"></div>

        {
          isShowMenu ? (
            <Menu mode="inline" theme="dark"
                  defaultSelectedKeys={defaultSelectedKeys}
                  defaultOpenKeys={defaultOpenKeys}
                  onSelect={this.handleSelectMenu}>
              {
                menuData.children.map((item) => {
                  return this.getRenderMenuItem(item)
                })
              }
            </Menu>
          ) : null
        }

        <div className="sidebar-action" onClick={this.handleCollapseClick}>
          {collapse ? <Icon type="right" /> : <Icon type="left" />}
        </div>

      </aside>
    );
  }
}

const mapStateToProps = (state) => {
  const { sidebarInfo } = state;

  return {
    collapse: sidebarInfo.collapse,
    menuData: sidebarInfo.menuData,
    menuDataMap: sidebarInfo.menuDataMap,
  };
};

const mapDispatchToProps = { collapseSidebar, unCollapseSidebar, loadMenu };

export default connect(mapStateToProps, mapDispatchToProps)(LayoutSidebar);
