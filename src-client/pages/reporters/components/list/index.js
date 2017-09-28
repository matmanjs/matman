import _ from 'lodash';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router';

import { Card, Col, Row, Button } from 'antd';

import { loadReporterList } from '../../business/reporter-list/action';

import './index.less';

class ReporterList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      curTag: '全部'
    };

    this.handleClickTag = this.handleClickTag.bind(this);
  }

  componentDidMount() {
    console.log('ReporterList componentDidMount', this.props);

    this.props.loadReporterList();
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
      <div className="reporters-list">
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

                      <Link to={`/admin/reporters/reporter/${item.name}`}>
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
  const { reporterListInfo } = state;

  return {
    isLoaded: reporterListInfo.isLoaded,
    list: reporterListInfo.list,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadReporterList(){
      return dispatch(loadReporterList());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReporterList);

