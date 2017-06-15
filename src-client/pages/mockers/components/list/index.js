import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Route,
  Link
} from 'react-router-dom';

import { loadMockerList } from 'root/business/matman-mocker-list/action';

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
    const { match, list } = this.props;

    return (
      <div>
        <h3>match</h3>
        <p>{JSON.stringify(match)}</p>

        <h3>Mocker List</h3>

        <div className="list-wrapper">
          <ul>
            {
              list.map((item, index) => {
                return (
                  <li key={index}>
                    <Link to={`${match.url}/${item.name}`}>{item.name} - {item.fullPath}</Link>
                    <ul>
                      {
                        item.modules.map((module, index2) => {
                          return (
                            <li key={index2}>
                              {index2} : {module.name} - {module.version} - {module.description}
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

