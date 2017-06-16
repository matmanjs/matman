export default {
  path: '/admin/mockers/mocker/:mockerName',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./index').default);
    })
  }
};
