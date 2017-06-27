import React, { Component } from 'react';
import { connect } from 'react-redux';
import superagent from 'superagent';

import { loadMocker, loadMockerReadme, setMockerActiveModule, setMockerDisable } from '../../business/mocker/action';

import MockerBreadcrumb from './display-breadcrumb';
import MockerDetail from './display-detail';
import MockerShowResult from './display-show-result';
import MockerSwitcher from './display-switcher';
import MockerMockModuleList from './display-mock-module-list';
import MockerReadme from './display-readme';

import './index.less';

class Mocker extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showModal: false,
      modalShowData: {},
      cgiParams: {},
      actualURL: ''
    };

    this.handleActive = this.handleActive.bind(this);
    this.handleModalHide = this.handleModalHide.bind(this);
    this.handleShowResult = this.handleShowResult.bind(this);
    this.handleParamsChange = this.handleParamsChange.bind(this);
    this.handleDisable = this.handleDisable.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoaded && (this.props.isLoaded !== nextProps.isLoaded)) {
      // 加载完 mocker 信息之后，要初始化填写的参数
      const { mockerData } = nextProps;
      let mockerParams = mockerData.params || [];
      let { cgiParams } = this.state;

      if (mockerParams.length) {
        mockerParams.forEach((item) => {
          if (item.defaultValue) {
            cgiParams[item.name] = item.defaultValue;
          }
        });
      }

      this.setState({
        cgiParams: cgiParams,
        actualURL: this.getActualURL(mockerData, cgiParams)
      });
    }
  }

  componentDidMount() {
    console.log('Mocker componentDidMount', this.props);

    // 加载这个 mocker 的信息
    this.props.loadMocker(this.props.routeParams.mockerName);
    this.props.loadMockerReadme(this.props.routeParams.mockerName);
  }

  getMockModuleByPost(url, data) {
    return new Promise((resolve, reject) => {
      superagent.post(url)
        .set('Content-Type', 'application/json')
        .send(data)
        .withCredentials()
        .end((err, res) => {
          if (err) {
            return reject(err);
          }

          resolve(res.body);
        });
    });
  }

  getMockModuleByGet(url, data) {
    return new Promise((resolve, reject) => {
      superagent.get(url)
        .query(data)
        .withCredentials()
        .end((err, res) => {
          if (err) {
            return reject(err);
          }

          resolve(res.body);
        });
    });
  }

  handleActive(name) {
    this.props.setMockerActiveModule(this.props.mockerData.name, name);
  }

  handleModalHide() {
    this.setState({
      showModal: false,
      modalShowData: {},
    });
  }

  handleShowResult(query = {}, host) {
    const { mockerData } = this.props;
    let { actualURL } = this.state;

    // 如果有指定的host，则使用指定的host
    if (host && (actualURL.indexOf(host) < 0)) {
      actualURL = `http://${host}${actualURL}`;
    }

    if (mockerData.method === 'post') {
      this.getMockModuleByPost(actualURL, query)
        .then((data) => {
          console.log(data);
          this.setState({
            showModal: true,
            modalShowData: data,
          })
        })
        .catch((err) => {
          console.error(err)
        });
    } else {
      this.getMockModuleByGet(actualURL, query)
        .then((data) => {
          console.log(data);
          this.setState({
            showModal: true,
            modalShowData: data,
          })
        })
        .catch((err) => {
          console.error(err)
        });
    }
  }

  handleParamsChange(fieldName, event) {
    let { mockerData } = this.props;
    let { cgiParams } = this.state;

    cgiParams[fieldName] = event.target.value;

    this.setState({
      cgiParams: cgiParams,
      actualURL: this.getActualURL(mockerData, cgiParams)
    });
  }

  handleDisable() {
    // console.log('handleDisable', this.props.mockerData.disable);
    this.props.setMockerDisable(this.props.mockerData.name, !this.props.mockerData.disable);
  }

  getActualURL(mockerData, cgiParams) {
    let curUrl = mockerData.route;

    if (Object.keys(cgiParams).length) {
      Object.keys(cgiParams).forEach((key) => {
        curUrl = curUrl.replace(':' + key, cgiParams[key]);
      })
    }

    console.log('curUrl', curUrl);
    return curUrl;
  }

  render() {
    const { isLoaded, mockerData, readme } = this.props;
    const { showModal, modalShowData, actualURL } = this.state;

    return (
      <div className="mockers-mocker">

        <MockerBreadcrumb name={mockerData.name} />

        {
          isLoaded ? (
            <div>
              <MockerSwitcher
                isDisabled={mockerData.disable}
                updateDisable={this.handleDisable}
              />

              <MockerDetail
                mockerData={mockerData}
                actualURL={actualURL}
                onParamsChange={this.handleParamsChange}
                onShowResult={this.handleShowResult}
              />

              <MockerMockModuleList
                isLoaded={isLoaded}
                mockerData={mockerData}
                onShowResult={this.handleShowResult}
                updateActive={this.handleActive}
              />

              <MockerShowResult
                isShow={showModal}
                data={modalShowData}
                onHide={this.handleModalHide}
              />

              <MockerReadme htmlContent={readme} />

            </div>
          ) : (
            <div>加载中...</div>
          )
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { mockerInfo } = state;

  return {
    isLoaded: mockerInfo.isLoaded,
    mockerData: mockerInfo.data,
    readme: mockerInfo.readme,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadMocker(mockerName){
      return dispatch(loadMocker(mockerName));
    },

    loadMockerReadme(mockerName){
      return dispatch(loadMockerReadme(mockerName));
    },

    setMockerActiveModule(mockerName, mockModuleName){
      return dispatch(setMockerActiveModule(mockerName, mockModuleName));
    },

    setMockerDisable(mockerName, value){
      return dispatch(setMockerDisable(mockerName, value));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Mocker);


