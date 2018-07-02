import React from 'react';

import { Breadcrumb } from 'antd';
import { NavLink } from 'react-router-dom';

import './index.less';

export default function MockerSwitcher(props) {
  const { name, match } = props;

  let arr = match.url.split('/');
  arr.pop();

  const parentPath = arr.join('/');

  return (
    <div className="mocker-breadcrumb">

      <Breadcrumb>
        <Breadcrumb.Item>
          <NavLink to={parentPath}> 列表 </NavLink>
        </Breadcrumb.Item>

        <Breadcrumb.Item>
          {name}
        </Breadcrumb.Item>
      </Breadcrumb>

    </div>
  );
}
