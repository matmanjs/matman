import React, { Component } from 'react';
import { connect } from 'react-redux';

class MockerList extends Component {
  constructor(props, context) {
    super(props, context);

  }

  componentDidMount() {
    console.log('MockerList componentDidMount', this.props);
    // this.props.match === {"path":"/admin/mockers","url":"/admin/mockers","isExact":true,"params":{}}
  }

  render() {
    const { match } = this.props;

    return (
      <div>
        <h3>hhhhhhhh</h3>
        <h3>{JSON.stringify(match)}</h3>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {mockerListInfo} = state;

  return mockerListInfo;
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(MockerList);
// export default MockerList;

