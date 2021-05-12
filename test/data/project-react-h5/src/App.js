import React, { Component } from 'react';

import SectionTitle from './components/section-title';
import FormSubmit from './components/form-submit';
import VerifyIdentityFormContent from './components/verify-identity-form-content';

import {
  ACTION_RESULT,
  checkIfIdValid,
  getCheckedName,
  requestVerifyIdentity
} from './business/project-verify-identity';

import './App.less';

export default class App extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      nameValue: '',
      idValue: ''
    };
  }

  checkVerifyParamsValid() {
    const { nameValue, idValue } = this.state;

    return nameValue && checkIfIdValid(idValue);
  }

  /**
   * 获取并检验用户输入的姓名
   */
  handelNameChange = (e) => {
    this.setState({
      nameValue: getCheckedName(e.target.value)
    });
  };

  /**
   * 获取并检验用户输入的身份证号码
   */
  handelIdChange = (e) => {
    this.setState({
      idValue: e.target.value
    });
  };

  handleVerifyIdentity = () => {
    const { nameValue, idValue } = this.state;

    if (this._isLoading) {
      return;
    }

    if (!this.checkVerifyParamsValid()) {
      return;
    }

    this._isLoading = true;

    requestVerifyIdentity(nameValue, idValue)
      .then((data) => {
        console.log(data);

        // 认证成功之后清空输入
        if (data && data.code === ACTION_RESULT.GO_WITHDRAW_PAGE) {
          this.setState({
            nameValue: '',
            idValue: ''
          });
        }

        this._isLoading = false;
      })
      .catch((err) => {
        this._isLoading = false;
      });
  };

  render() {
    const { nameValue, idValue } = this.state;

    // 身份证信息是否已OK
    const shouldActiveIdentity = this.checkVerifyParamsValid();

    return (
      <div className="verify-identity">
        <SectionTitle css="verify-identity-title" title="请核实身份信息，确保成功提现" />

        <VerifyIdentityFormContent
          nameValue={nameValue}
          idValue={idValue}
          handelIdChange={this.handelIdChange}
          handelNameChange={this.handelNameChange}
        />

        <FormSubmit
          text={'申请验证'}
          isActive={shouldActiveIdentity}
          enter={this.handleVerifyIdentity}
        />
      </div>
    );
  }
}
