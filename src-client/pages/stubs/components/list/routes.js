export default {
  path: '/admin/stubs/list',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./index').default);
    })
  }
};
