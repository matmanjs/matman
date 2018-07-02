import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Button, Col, Row } from 'antd';

import { loadMockerList } from '../../data/data-mocker-list';
import ListItem from './list-item';

import './index.less';
import { setMockerActiveModule, setMockerDisable } from '../../data/data-mocker';

class MockersList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      curTag: '全部'
    };
  }

  componentDidMount() {
    this.props.loadMockerList();
  }

  getAllTags() {
    const { list } = this.props;

    let arr = [];

    list.forEach((item) => {
      arr = arr.concat(item.config.tags);
    });

    return _.uniq(arr);
  }

  getFilterList() {
    const { curTag } = this.state;
    const { list } = this.props;

    return list.filter(item => item.config.tags.indexOf(curTag) > -1);
  }

  handleClickTag = (tagName) => {
    this.setState({
      curTag: tagName
    });
  };

  handleActive = (mockerName, mockModuleName) => {
    this.props.setMockerActiveModule(mockerName, mockModuleName);
  };

  handleDisable = (mockerName, curIsDisabled) => {
    this.props.setMockerDisable(mockerName, !curIsDisabled);
  };

  getResultToRenderList(filterList) {
    let length = filterList.length;
    let groupChildLength = 3;
    let groupLength = (length % groupChildLength !== 0) ? parseInt(length / groupChildLength, 10) + 1 : parseInt(length / groupChildLength, 10);

    let result = [];

    for (let i = 0; i < groupLength; i++) {
      let arr = [];

      for (let j = i * groupChildLength; (j < (i + 1) * groupChildLength) && (j < length); j++) {
        // console.log('=====', i, j, filterList[j].name);
        arr.push(filterList[j]);
      }

      result.push(arr);
    }

    return result;
  }

  render() {
    const { match } = this.props;
    const { curTag } = this.state;

    const tagList = this.getAllTags();
    const filterList = this.getFilterList();

    const list = this.getResultToRenderList(filterList);

    return (
      <div className="mockers">
        <div className="tag-wrapper">
          <Button.Group>
            {
              tagList.map((tagName, tagIndex) => {
                return <Button
                  key={tagIndex}
                  className={tagName === curTag ? 'active' : ''}
                  icon="tag"
                  onClick={this.handleClickTag.bind(this, tagName)}>{tagName}</Button>;
              })
            }
          </Button.Group>
        </div>

        <div className="list-wrapper">
          {
            list.map((subList, subListIndex) => {
              return (
                <Row gutter={16} key={subListIndex}>
                  {
                    subList.map((item, index) => {
                      return (
                        <Col span={8} key={index}>
                          <ListItem index={subListIndex * 3 + index}
                                    curTag={curTag}
                                    mockerItem={item}
                                    mockersPath={match.url}
                                    clickTag={this.handleClickTag}
                                    setActive={this.handleActive}
                                    setDisable={this.handleDisable}
                          />
                        </Col>
                      );
                    })
                  }
                </Row>
              );
            })
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { mockerListInfo } = state;

  return {
    isLoaded: mockerListInfo.isLoaded,
    list: mockerListInfo.list
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadMockerList() {
      return dispatch(loadMockerList());
    },

    setMockerActiveModule(mockerName, mockModuleName) {
      return dispatch(setMockerActiveModule(mockerName, mockModuleName));
    },

    setMockerDisable(mockerName, value) {
      return dispatch(setMockerDisable(mockerName, value));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MockersList);
