import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router';

import { Card, Col, Row, Button } from 'antd';

import { loadMockerList } from '../../business/mocker-list/action';

import './index.less';

class MockerList extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    console.log('MockerList componentDidMount', this.props);

    this.props.loadMockerList();
  }

  render() {
    const { list } = this.props;

    return (
      <div className="mockers-list">
        <div className="list-wrapper">
          {
            list.map((item, index) => {
              return (
                <Row key={index}>
                  <Col span={24}>
                    <Card title={`${index + 1}. ${item.name}`}>
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
              )
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

