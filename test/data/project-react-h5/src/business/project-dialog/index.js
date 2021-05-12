import Dialog from '../../components/base-dialog';

/**
 * 展示消息
 *
 * @param {Object} opts 配置
 */
export default function showDialog(opts) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[showDialog]', opts);
  }

  const params = Object.assign({
    text: '提示文案',
    enterText: '确定',
    skin: 'mid'
  }, opts);

  // eslint-disable-next-line prefer-const
  let dlg;

  const removeDlg = () => {
    if (typeof dlg !== 'undefined') {
      dlg.remove();
    }
  };

  // 处理 onEnter
  const _onEnter = params.onEnter;
  params.onEnter = () => {
    removeDlg();

    if (typeof _onEnter === 'function') {
      _onEnter();
    }
  };

  // 处理 onCancel
  const _onCancel = params.onCancel;
  params.onCancel = !opts.hideCancel ? (() => {
    if (typeof _onCancel === 'function') {
      _onCancel();
    }

    removeDlg();
  }) : null;

  dlg = Dialog.create(params);
}
