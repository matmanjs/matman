import React from 'react';

import { Breadcrumb } from 'antd';
import { IndexLink, Link } from 'react-router';

import './index.less';

export default function MockerSwitcher(props) {
  const { name } = props;

  return (
    <div className="mocker-breadcrumb">

      <Breadcrumb>
        <Breadcrumb.Item><IndexLink to='/'> 首页 </IndexLink ></Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/admin/mockers/list"> mocker 列表 </Link></Breadcrumb.Item>
        <Breadcrumb.Item> {name} </Breadcrumb.Item>
      </Breadcrumb>

    </div>
  );
}
