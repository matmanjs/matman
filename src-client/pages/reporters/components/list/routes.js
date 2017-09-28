export default {
  path: '/admin/reporters/list',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./index').default);
    })
  }
};
