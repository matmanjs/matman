export default {
  path: '/admin/reporters',

  indexRoute: {
    onEnter(nextState, replace) {
      return replace('/admin/reporters/list');
    }
  },

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./index').default);
    })
  },

  getChildRoutes(partialNextState, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./components/list/routes').default,
        require('./components/reporter/routes').default,
      ]);
    })
  },

};