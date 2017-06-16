export default {
  path: '/admin/mockers',

  indexRoute: {
    onEnter(nextState, replace) {
      return replace('/admin/mockers/list');
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
        require('./components/mocker/routes').default,
      ]);
    })
  },

};