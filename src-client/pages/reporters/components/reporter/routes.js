export default {
  path: '/admin/reporters/reporter/:reporterName',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./index').default);
    })
  }
};
