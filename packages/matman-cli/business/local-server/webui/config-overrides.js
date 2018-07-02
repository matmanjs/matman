const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {
  config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);

  // https://github.com/ant-design/ant-design/issues/7927
  config = rewireLess.withLoaderOptions({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#1DA57A' }
  })(config, env);

  return config;
};