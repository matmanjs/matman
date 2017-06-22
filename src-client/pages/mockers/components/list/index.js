import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router';

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
          <ul>
            {
              list.map((item, index) => {
                return (
                  <li key={index}>
                    <h3>{index + 1}. {item.name}</h3>
                    <p>{item.description}</p>
                    <p>{item._fullPath}</p>
                    <Link to={`/admin/mockers/mocker/${item.name}`}>{item.name}</Link>
                  </li>
                )
              })
            }
          </ul>
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

