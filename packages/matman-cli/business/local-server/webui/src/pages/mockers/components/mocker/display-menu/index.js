import React, { Component } from 'react';
import { Menu } from 'antd';
import { withRouter } from 'react-router-dom';

import './index.less';

class MockerMenu extends Component {
  constructor(props, context) {
    super(props, context);

  }

  handleClick = ({ item, key }) => {
    if (this.props.match.params.mockerName !== key) {
      this.props.history.push(this.props.match.path.replace(/:mockerName/gi, key));

      // 通知右侧重新刷新
      this.props.refresh(key);
    }
  };

  render() {
    let { mockerListInfo, match } = this.props;
    if (!mockerListInfo.isLoaded) {
      return null;
    }

    let { mockerName } = match.params;

    return (
      <div className="mocker-menu">
        <Menu
          defaultSelectedKeys={[mockerName]}
          selectedKeys={[mockerName]}
          onClick={this.handleClick}
        >

          {
            mockerListInfo.list.map((item) => {
              return (
                <Menu.Item key={item.name}>
                  {item.name}
                </Menu.Item>
              );
            })
          }

        </Menu>
      </div>
    );
  }
}

export default withRouter(MockerMenu);