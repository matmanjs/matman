import React from 'react';

import { Alert,Button, Card } from 'antd';
import { NavLink } from 'react-router-dom';

import './index.less';

export default function MockerListItem(props) {
  const { mockerItem, mockersPath, curTag, index, clickTag, setActive, setDisable } = props;
  const mockerItemConfig = mockerItem.config;

  const isDisabled = mockerItemConfig.disable;

  return (
    <Card className="mocker-list-item" title={`${index + 1}. ${mockerItem.name}`} extra={
      <div className="card-action">
        <Button type={isDisabled ? 'primary' : 'default'}
                icon="setting"
                className="set-disable-btn"
                onClick={setDisable.bind(this, mockerItem.name, isDisabled)}
        >
          {isDisabled ? '启用' : '禁用'}
        </Button>

        <NavLink to={`${mockersPath}/${mockerItem.name}`}>
          更多...
        </NavLink>
      </div>
    }>
      <div className="detail">
        <Alert
          message={mockerItemConfig.description}
          type="info"
          showIcon
        />
      </div>

      <p>点击标签进行过滤：</p>

      <Button.Group>
        {
          mockerItemConfig.tags.map((tagName, tagIndex) => {
            return (
              <Button
                key={tagIndex}
                className={tagName === curTag ? 'active' : ''}
                icon="tag"
                onClick={clickTag.bind(this, tagName)}>

                {tagName}

              </Button>
            );
          })
        }
      </Button.Group>

      <br />
      <br />

      <p>请选择需要激活的模块：</p>
      <Button.Group>
        {
          mockerItem.mockModuleList.map((item, index) => {
            return (
              <Button key={index}
                      disabled={isDisabled ? 'disable' : ''}
                      className={item.name === mockerItemConfig.activeModule ? 'active' : ''}
                      icon={item.name === mockerItemConfig.activeModule ? 'check' : ''}
                      onClick={setActive.bind(this, mockerItem.name, item.name)}
              >
                {item.name}
              </Button>
            );
          })
        }
      </Button.Group>

    </Card>
  );
}

