import React, { Component } from 'react';
import { connect } from 'react-redux';
import superagent from 'superagent';

import { loadMocker, loadMockerReadme, setMockerActiveModule, setMockerDisable } from '../../business/stub/action';

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
      // 加载完 stub 信息之后，要初始化填写的参数
      const { stubData } = nextProps;
      let stubParams = stubData.params || [];
      let { cgiParams } = this.state;

      if (stubParams.length) {
        stubParams.forEach((item) => {
          if (item.defaultValue) {
            cgiParams[item.name] = item.defaultValue;
          }
        });
      }

      this.setState({
        cgiParams: cgiParams,
        actualURL: this.getActualURL(stubData, cgiParams)
      });
    }
  }

  componentDidMount() {
    console.log('Mocker componentDidMount', this.props);

    // 加载这个 stub 的信息
    this.props.loadMocker(this.props.routeParams.stubName);
    this.props.loadMockerReadme(this.props.routeParams.stubName);
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
    this.props.setMockerActiveModule(this.props.stubData.name, name);
  }

  handleModalHide() {
    this.setState({
      showModal: false,
      modalShowData: {},
    });
  }

  handleShowResult(query = {}, host) {
    const { stubData } = this.props;
    let { actualURL } = this.state;

    // 如果有指定的host，则使用指定的host
    if (host && (actualURL.indexOf(host) < 0)) {
      actualURL = `http://${host}${actualURL}`;
    }

    if (stubData.method === 'post') {
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
    let { stubData } = this.props;
    let { cgiParams } = this.state;

    cgiParams[fieldName] = event.target.value;

    this.setState({
      cgiParams: cgiParams,
      actualURL: this.getActualURL(stubData, cgiParams)
    });
  }

  handleDisable() {
    // console.log('handleDisable', this.props.stubData.disable);
    this.props.setMockerDisable(this.props.stubData.name, !this.props.stubData.disable);
  }

  getActualURL(stubData, cgiParams) {
    let curUrl = stubData.route;

    if (Object.keys(cgiParams).length) {
      Object.keys(cgiParams).forEach((key) => {
        curUrl = curUrl.replace(':' + key, cgiParams[key]);
      })
    }

    console.log('curUrl', curUrl);
    return curUrl;
  }

  render() {
    const { isLoaded, stubData, readme } = this.props;
    const { showModal, modalShowData, actualURL } = this.state;

    return (
      <div className="stubs-stub">

        <MockerBreadcrumb name={stubData.name} />

        {
          isLoaded ? (
            <div>
              <MockerSwitcher
                isDisabled={stubData.disable}
                updateDisable={this.handleDisable}
              />

              <MockerDetail
                stubData={stubData}
                actualURL={actualURL}
                onParamsChange={this.handleParamsChange}
                onShowResult={this.handleShowResult}
              />

              <MockerMockModuleList
                isLoaded={isLoaded}
                stubData={stubData}
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
  const { stubInfo } = state;

  return {
    isLoaded: stubInfo.isLoaded,
    stubData: stubInfo.data,
    readme: stubInfo.readme,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadMocker(stubName){
      return dispatch(loadMocker(stubName));
    },

    loadMockerReadme(stubName){
      return dispatch(loadMockerReadme(stubName));
    },

    setMockerActiveModule(stubName, mockModuleName){
      return dispatch(setMockerActiveModule(stubName, mockModuleName));
    },

    setMockerDisable(stubName, value){
      return dispatch(setMockerDisable(stubName, value));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Mocker);


