import { showDialogToGoQQWallet } from '../project-qq-wallet';
import login from '../project-login';
import showMessageTips from '../project-message-tips';
import axios from 'axios';

/**
 * 处理姓名输入，过滤非法字符并返回处理结果
 *
 * @param {String} value 输入值
 * @return {String}
 */
export function getCheckedName(value = '') {
  // 去掉多余空格
  return value.replace(/\s/g, '');
}

/**
 * 身份证ID是否正常
 *
 * @param {String} value 身份证ID
 * @return {Boolean}
 */
export function checkIfIdValid(value) {
  const regExp = /^(11|12|13|14|15|21|22|23|31|32|33|34|35|36|37|41|42|43|44|45|46|50|51|52|53|54|61|62|63|64|65|71|81|82|91)\d{4}(((19|[2-9]\d)\d{2}(((0[13578]|1[02])31)|((0[1,3-9]|1[0-2])(29|30))))|((((19|[2-9]\d)(0[48]|[2468][048]|[13579][26]))|(([2468][048]|[3579][26])00))0229)|((19|[2-9]\d)\d{2}((0[1-9])|(1[0-2]))(0[1-9]|1\d|2[0-8])))\d{3}(\d|X|x)$/;
  return regExp.test(value);
}

/**
 * 业务错误码，当 retcode=0 时，取 result.errcode
 * @type {Object}
 */
export const VERIFY_RESULT_CODE = {
  // 认证成功
  SUCCESS: 0,

  // 不是财付通用户
  NOT_TENPAY_USER: 66230402,

  // 身份证已被绑定
  ID_IS_BOUND: 900002
};

/**
 * retcode 接口状态码
 * @type {Object}
 */
export const CGI_RET_CODE = {
  // 成功
  SUCCESS: 0,

  // 登录态过期
  NOT_LOGIN: 100000,

  // 内部错误
  INTERNAL_ERROR: 500
};

/**
 * 根据身份认证结果码，获得下一步的行为操作
 *
 * @type {Object}
 */
export const ACTION_RESULT = {
  // 跳转到提现页面
  GO_WITHDRAW_PAGE: 'GO_WITHDRAW_PAGE',

  // 弹出对话框提示去手Q钱包认证
  SHOW_DLG_GO_QQ_WALLET: 'SHOW_DLG_GO_QQ_WALLET',

  // 该身份证号码已经被绑定
  IS_ID_BIND: 'IS_ID_BIND',

  // 登录态过期
  LOGIN_EXPIRED: 'LOGIN_EXPIRED',

  // 其他错误
  OTHER_ERROR: 'OTHER_ERROR'
};

export function requestVerifyIdentity(nameValue, idValue) {
  return new Promise((resolve, reject) => {
    axios.post('//cgi.now.qq.com/cgi-bin/a/b/verify-identity', {
      nameValue,
      idValue
    })
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        // 获得行为结果
        const actionResult = getActionResultFromRes(data);

        // 执行行为结果逻辑
        resolve(handleActionResult(actionResult));
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * 获取处理身份证验证的结果
 *
 * @param {Object} res 后台结果
 * @return {Object}
 */
export function getActionResultFromRes(res = {}) {
  let code;
  let msg;
  let isSuccess;

  if (res.retcode === CGI_RET_CODE.SUCCESS) {
    // 接口数据返回正常数据
    switch (res.result.errcode) {
      case VERIFY_RESULT_CODE.SUCCESS:
        // 实名认证成功，跳转至提现页
        code = ACTION_RESULT.GO_WITHDRAW_PAGE;
        msg = '认证成功';
        isSuccess = true;
        break;

      case VERIFY_RESULT_CODE.ID_IS_BOUND:
        code = ACTION_RESULT.IS_ID_BIND;
        msg = '当前身份证信息已被绑定';
        isSuccess = false;
        break;

      case VERIFY_RESULT_CODE.NOT_TENPAY_USER:
        code = ACTION_RESULT.SHOW_DLG_GO_QQ_WALLET;
        isSuccess = false;
        break;

      default:
        // 其他的未特别处理的状态码
        code = ACTION_RESULT.OTHER_ERROR;
        msg = `绑卡状态获取失败(${res.result.errcode})，请重试`;
        isSuccess = false;
        break;
    }
  } else {
    // 接口数据返回错误
    switch (res.retcode) {
      case CGI_RET_CODE.NOT_LOGIN:
        code = ACTION_RESULT.LOGIN_EXPIRED;
        isSuccess = false;
        break;

      case CGI_RET_CODE.INTERNAL_ERROR:
        code = ACTION_RESULT.OTHER_ERROR;
        msg = `内部错误，请稍后重试(${res.retcode})`;
        isSuccess = false;
        break;

      default:
        code = ACTION_RESULT.OTHER_ERROR;
        msg = `网络异常，请稍后重试(${res.retcode})`;
        isSuccess = false;
        break;
    }
  }

  return {
    code,
    msg,
    isSuccess
  };
}

/**
 * 处理结果行为
 * @param {Object} actionResult
 * @return {Object}
 */
export function handleActionResult(actionResult) {
  switch (actionResult.code) {
    case ACTION_RESULT.GO_WITHDRAW_PAGE:
      // 跳转到提现页
      actionResult._isReadyToJump = true;
      jumpToWithdrawPage();
      break;

    case ACTION_RESULT.SHOW_DLG_GO_QQ_WALLET:
      // 展示跳转至QQ钱包的弹窗
      showDialogToGoQQWallet();
      break;

    case ACTION_RESULT.LOGIN_EXPIRED:
      // 登录态过期，重新登录
      actionResult._isReadyToJump = true;
      login();
      break;
    default :
      break;
  }

  // 如果有消息，则展示提示
  if (actionResult.msg) {
    showMessageTips(actionResult.msg, actionResult.isSuccess);
  }

  return actionResult;
}

/**
 * 跳转到提现页
 */
export function jumpToWithdrawPage() {
  // 这里之所以要延时 2s 是为了先展示一个提示页信息，提示用户认证成功
  setTimeout(() => {
    window.location.href = 'https://now.qq.com/withdraw.html?from=9527';
  }, 2000);
}
