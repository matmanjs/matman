import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Link
} from 'react-router';

import { Radio, Input } from 'antd';
const RadioGroup = Radio.Group;

import { loadMockerList } from '../../business/mocker-list/action';
import { setMockerActiveModule } from '../../business/mocker/action';

class MockerList extends Component {
  constructor(props, context) {
    super(props, context);

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    console.log('MockerList componentDidMount', this.props);
    // this.props.match === {"path":"/admin/mockers","url":"/admin/mockers","isExact":true,"params":{}}

    this.props.loadMockerList();
  }

  onChange(e) {
    console.log('onChange', e)
    console.log('radio checked', e.target.value);

    let arr = e.target.value.split('/');

    if (arr.length === 2) {
      this.props.setMockerActiveModule(arr[0], arr[1]);
    }
  }

  render() {
    const { location, route, list } = this.props;

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return (
      <div>
        <h3>location</h3>
        <p>{JSON.stringify(location)}</p>
        <h3>route</h3>
        <p>{JSON.stringify(route)}</p>
        <p>{JSON.stringify(list)}</p>

        <h3>Mocker List</h3>

        <div className="list-wrapper">
          <ul>
            {
              list.map((item, index) => {
                return (
                  <li key={index}>
                    <h3>{index + 1}. {item.description}</h3>
                    <p><a href={item.cgi} target="_blank">{item.cgi}</a></p>
                    <Link to={`/admin/mockers/mocker/${item.name}`}>{item.name}
                      - {item.fullPath}</Link>

                    <br />
                    <RadioGroup onChange={this.onChange} value={`${item.name}/${item.operation.activeModule}`}>
                      {
                        item.modules.map((module, index2) => {
                          return (
                            <Radio style={radioStyle} value={`${item.name}/${module.name}`}
                                   key={index2}>{index + 1}.{index2 + 1} {module.name}
                              - {module.version}- {module.description}</Radio>
                          )
                        })
                      }
                    </RadioGroup>

                    <ul>
                      {
                        item.modules.map((module, index2) => {
                          return (
                            <li key={index2}>
                              <p>{index + 1}.{index2 + 1} {module.name} - {module.version}
                                - {module.description}</p>
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
    },

    setMockerActiveModule(mockerName, mockModuleName){
      return dispatch(setMockerActiveModule(mockerName, mockModuleName));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MockerList);
// export default MockerList;

