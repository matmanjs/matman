import MessageTips from '../../components/base-message-tips';

/**
 * 展示消息
 *
 * @param {String} msg 消息内容
 * @param {Boolean} [isSuccess] 是否为成功的内容
 * @param {Number} [delay] 延时多久消失，单位为毫秒，默认值为 3000
 */
export default function showMessageTips(msg, isSuccess, delay = 3000) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[showMessageTips]', msg, isSuccess, delay);
  }

  MessageTips.create({
    isSuccess,
    msg,
    delay
  });
}
