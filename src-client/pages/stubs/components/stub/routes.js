export default {
  path: '/admin/stubs/stub/:stubName',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./index').default);
    })
  }
};
