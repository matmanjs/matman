import React, { Component } from 'react';
import { connect } from 'react-redux';
import superagent from 'superagent';
import io from 'socket.io-client';

import { loadStub, loadStubReadme, setStubActiveModule, setStubDisable } from '../../business/stub/action';

import StubBreadcrumb from './display-breadcrumb';
import StubDetail from './display-detail';
import StubShowResult from './display-show-result';
import StubSwitcher from './display-switcher';
import StubMockModuleList from './display-mock-module-list';
import StubReadme from './display-readme';

import './index.less';

const socket = io();

class Stub extends Component {
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
    this.handleEmitStub = this.handleEmitStub.bind(this);
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
    console.log('Stub componentDidMount', this.props);

    // 加载这个 stub 的信息
    this.props.loadStub(this.props.routeParams.stubName);
    this.props.loadStubReadme(this.props.routeParams.stubName);
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
    this.props.setStubActiveModule(this.props.stubData.name, name);
  }

  handleModalHide() {
    this.setState({
      showModal: false,
      modalShowData: {}
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
            modalShowData: data
          });
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      this.getMockModuleByGet(actualURL, query)
        .then((data) => {
          console.log(data);
          this.setState({
            showModal: true,
            modalShowData: data
          });
        })
        .catch((err) => {
          console.error(err);
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
    this.props.setStubDisable(this.props.stubData.name, !this.props.stubData.disable);
  }

  handleEmitStub(data) {
    console.log('handleEmitStub', data);
    socket.emit('emitStub', {
      route: this.props.stubData.route,
      name: this.props.stubData.name,
      activeModule: this.props.stubData.activeModule,
      result: data
    });
  }

  getActualURL(stubData, cgiParams) {
    let curUrl = stubData.route;

    if (Object.keys(cgiParams).length) {
      Object.keys(cgiParams).forEach((key) => {
        curUrl = curUrl.replace(':' + key, cgiParams[key]);
      });
    }

    console.log('curUrl', curUrl);
    return curUrl;
  }

  render() {
    const { isLoaded, stubData, readme } = this.props;
    const { showModal, modalShowData, actualURL } = this.state;

    return (
      <div className="stubs-stub">

        <StubBreadcrumb name={stubData.name} />

        {
          isLoaded ? (
            <div>
              <StubSwitcher
                isDisabled={stubData.disable}
                updateDisable={this.handleDisable}
              />

              <StubDetail
                stubData={stubData}
                actualURL={actualURL}
                onParamsChange={this.handleParamsChange}
                onShowResult={this.handleShowResult}
              />

              <StubMockModuleList
                isLoaded={isLoaded}
                stubData={stubData}
                onShowResult={this.handleShowResult}
                updateActive={this.handleActive}
              />

              <StubShowResult
                isShow={showModal}
                data={modalShowData}
                onHide={this.handleModalHide}
                onEmitStub={this.handleEmitStub}
              />

              <StubReadme htmlContent={readme} />

            </div>
          ) : (
            <div>加载中...</div>
          )
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { stubInfo } = state;

  return {
    isLoaded: stubInfo.isLoaded,
    stubData: stubInfo.data,
    readme: stubInfo.readme
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadStub(stubName) {
      return dispatch(loadStub(stubName));
    },

    loadStubReadme(stubName) {
      return dispatch(loadStubReadme(stubName));
    },

    setStubActiveModule(stubName, mockModuleName) {
      return dispatch(setStubActiveModule(stubName, mockModuleName));
    },

    setStubDisable(stubName, value) {
      return dispatch(setStubDisable(stubName, value));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Stub);


