import React, { Component } from 'react';
import { connect } from 'react-redux';

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
    const { match, isLoaded, list } = this.props;

    return (
      <div>
        <h3>match</h3>
        <p>{JSON.stringify(match)}</p>

        <h3>Mocker List</h3>
        <p>isLoaded={isLoaded + ''}</p>
        <p>{JSON.stringify(list)}</p>
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

