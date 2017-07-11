import _ from 'lodash';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router';

import { Card, Col, Row, Button } from 'antd';

import { loadMockerList } from '../../business/mocker-list/action';

import './index.less';

class MockerList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      curTag: '全部'
    };

    this.handleClickTag = this.handleClickTag.bind(this);
  }

  componentDidMount() {
    console.log('MockerList componentDidMount', this.props);

    this.props.loadMockerList();
  }

  getAllTags(list) {

    let arr = [];

    list.forEach((item) => {
      arr = arr.concat(item.tags);
    });

    return _.uniq(arr);
  }

  handleClickTag(tagName) {
    this.setState({
      curTag: tagName
    });
  }

  render() {
    const { curTag } = this.state;
    const { list } = this.props;

    const tagList = this.getAllTags(list);

    return (
      <div className="mockers-list">
        <div className="tag-wrapper">
          <Button.Group>
            {
              tagList.map((tagName, tagIndex) => {
                return <Button
                  key={tagIndex}
                  className={tagName === curTag ? 'active' : ''}
                  icon="tag"
                  onClick={this.handleClickTag.bind(this, tagName)}>{tagName}</Button>
              })
            }
          </Button.Group>
        </div>
        <div className="list-wrapper">
          {
            list.map((item, index) => {
              return (item.tags.indexOf(curTag) > -1) ? (
                <Row key={index}>
                  <Col span={24}>
                    <Card title={`${index + 1}. ${item.name}`}>
                      <Button.Group>
                        {
                          item.tags.map((tagName, tagIndex) => {
                            return <Button
                              key={tagIndex}
                              className={tagName === curTag ? 'active' : ''}
                              icon="tag"
                              onClick={this.handleClickTag.bind(this, tagName)}>{tagName}</Button>
                          })
                        }
                      </Button.Group>
                      <div className="detail">
                        <p>{item.description}</p>
                        <p>{item._fullPath}</p>
                      </div>

                      <Link to={`/admin/mockers/mocker/${item.name}`}>
                        <Button type="primary" size="large" icon="tool">更多...</Button>
                      </Link>
                    </Card>
                  </Col>
                </Row>
              ) : null
            })
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { mockerListInfo } = state;

  return {
    isLoaded: mockerListInfo.isLoaded,
    list: mockerListInfo.list,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadMockerList(){
      return dispatch(loadMockerList());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MockerList);

