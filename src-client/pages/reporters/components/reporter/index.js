import React, { Component } from 'react';
import { connect } from 'react-redux';
import superagent from 'superagent';

import { loadReporter, loadReporterReadme, setReporterActiveModule, setReporterDisable } from '../../business/reporter/action';

import ReporterBreadcrumb from './display-breadcrumb';
import ReporterDetail from './display-detail';
import ReporterShowResult from './display-show-result';
import ReporterSwitcher from './display-switcher';
import ReporterReportModuleList from './display-handle-module-list';
import ReporterReadme from './display-readme';

import './index.less';

class Reporter extends Component {
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
      // 加载完 reporter 信息之后，要初始化填写的参数
      const { reporterData } = nextProps;
      let reporterParams = reporterData.params || [];
      let { cgiParams } = this.state;

      if (reporterParams.length) {
        reporterParams.forEach((item) => {
          if (item.defaultValue) {
            cgiParams[item.name] = item.defaultValue;
          }
        });
      }

      this.setState({
        cgiParams: cgiParams,
        actualURL: this.getActualURL(reporterData, cgiParams)
      });
    }
  }

  componentDidMount() {
    console.log('Reporter componentDidMount', this.props);

    // 加载这个 reporter 的信息
    this.props.loadReporter(this.props.routeParams.reporterName);
    this.props.loadReporterReadme(this.props.routeParams.reporterName);
  }

  getReportModuleByPost(url, data) {
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

  getReportModuleByGet(url, data) {
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
    this.props.setReporterActiveModule(this.props.reporterData.name, name);
  }

  handleModalHide() {
    this.setState({
      showModal: false,
      modalShowData: {},
    });
  }

  handleShowResult(query = {}, host) {
    const { reporterData } = this.props;
    let { actualURL } = this.state;

    // 如果有指定的host，则使用指定的host
    if (host && (actualURL.indexOf(host) < 0)) {
      actualURL = `http://${host}${actualURL}`;
    }

    if (reporterData.method === 'post') {
      this.getReportModuleByPost(actualURL, query)
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
      this.getReportModuleByGet(actualURL, query)
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
    let { reporterData } = this.props;
    let { cgiParams } = this.state;

    cgiParams[fieldName] = event.target.value;

    this.setState({
      cgiParams: cgiParams,
      actualURL: this.getActualURL(reporterData, cgiParams)
    });
  }

  handleDisable() {
    // console.log('handleDisable', this.props.reporterData.disable);
    this.props.setReporterDisable(this.props.reporterData.name, !this.props.reporterData.disable);
  }

  getActualURL(reporterData, cgiParams) {
    let curUrl = reporterData.route;

    if (Object.keys(cgiParams).length) {
      Object.keys(cgiParams).forEach((key) => {
        curUrl = curUrl.replace(':' + key, cgiParams[key]);
      })
    }

    console.log('curUrl', curUrl);
    return curUrl;
  }

  render() {
    const { isLoaded, reporterData, readme } = this.props;
    const { showModal, modalShowData, actualURL } = this.state;

    return (
      <div className="reporters-reporter">

        <ReporterBreadcrumb name={reporterData.name} />

        {
          isLoaded ? (
            <div>
              <ReporterSwitcher
                isDisabled={reporterData.disable}
                updateDisable={this.handleDisable}
              />

              <ReporterDetail
                reporterData={reporterData}
                actualURL={actualURL}
                onParamsChange={this.handleParamsChange}
                onShowResult={this.handleShowResult}
              />

              <ReporterReportModuleList
                isLoaded={isLoaded}
                reporterData={reporterData}
                onShowResult={this.handleShowResult}
                updateActive={this.handleActive}
              />

              <ReporterShowResult
                isShow={showModal}
                data={modalShowData}
                onHide={this.handleModalHide}
              />

              <ReporterReadme htmlContent={readme} />

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
  const { reporterInfo } = state;

  return {
    isLoaded: reporterInfo.isLoaded,
    reporterData: reporterInfo.data,
    readme: reporterInfo.readme,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadReporter(reporterName){
      return dispatch(loadReporter(reporterName));
    },

    loadReporterReadme(reporterName){
      return dispatch(loadReporterReadme(reporterName));
    },

    setReporterActiveModule(reporterName, reportModuleName){
      return dispatch(setReporterActiveModule(reporterName, reportModuleName));
    },

    setReporterDisable(reporterName, value){
      return dispatch(setReporterDisable(reporterName, value));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Reporter);


