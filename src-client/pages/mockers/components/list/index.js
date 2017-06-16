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
    // this.props.match === {"path":"/admin/mockers","url":"/admin/mockers","isExact":true,"params":{}}

    this.props.loadMockerList();
  }

  render() {
    const { location, route, list } = this.props;

    return (
      <div>
        <h3>location</h3>
        <p>{JSON.stringify(location)}</p>
        <h3>route</h3>
        <p>{JSON.stringify(route)}</p>

        <h3>Mocker List</h3>

        <div className="list-wrapper">
          <ul>
            {
              list.map((item, index) => {
                return (
                  <li key={index}>
                    <h3>{index + 1}. {item.description}</h3>
                    <p>{item.cgi}</p>
                    <Link to={`/admin/mockers/mocker/${item.name}`}>{item.name} - {item.fullPath}</Link>
                    <ul>
                      {
                        item.modules.map((module, index2) => {
                          return (
                            <li key={index2}>
                              <p>{index + 1}.{index2 + 1} {module.name} - {module.version} - {module.description}</p>
                              <p><a href={module.cgi} target="_blank">{module.cgi}</a></p>
                            </li>
                          )
                        })
                      }
                    </ul>
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
// export default MockerList;

