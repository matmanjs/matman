export default {
  path: '/admin/mockers/list',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./index').default);
    })
  }
};
