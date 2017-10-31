export default {
  childRoutes: [{
    path: '/',
    component: require('../containers/App').default,
    indexRoute: {
      onEnter(nextState, replace) {
        return replace('/admin/home');
      }
    },
    childRoutes: [
      require('../pages/home/routes').default,
      require('../pages/mockers/routes').default,
      require('../pages/reporters/routes').default,
      require('../pages/stubs/routes').default,
    ]
  }]
};
