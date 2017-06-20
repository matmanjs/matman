import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Link
} from 'react-router';

import { loadMockerList } from '../../business/mocker-list/action';

class MockerList extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    console.log('MockerList componentDidMount', this.props);

    this.props.loadMockerList();
  }

  render() {
    const { location, route, list } = this.props;

    return (
      <div>
        <h2>location</h2>
        <p>{JSON.stringify(location)}</p>

        <h2>route</h2>
        <p>{JSON.stringify(route)}</p>

        <h2>list</h2>
        <p>{JSON.stringify(list)}</p>

        <h2>Mocker List</h2>

        <div className="list-wrapper">
          <ul>
            {
              list.map((item, index) => {
                return (
                  <li key={index}>
                    <h3>{index + 1}. {item.description}</h3>
                    <Link to={`/admin/mockers/mocker/${item._cache.name}`}>{item._cache.name}
                      - {item.fullPath}</Link>
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

