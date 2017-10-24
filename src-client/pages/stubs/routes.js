export default {
  path: '/admin/stubs',

  indexRoute: {
    onEnter(nextState, replace) {
      return replace('/admin/stubs/list');
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
        require('./components/stub/routes').default,
      ]);
    })
  },

};