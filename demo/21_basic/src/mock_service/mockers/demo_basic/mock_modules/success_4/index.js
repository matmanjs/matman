module.exports = function (params, req) {
  if (params && params.a) {
    return 'from_param_' + params.a;
  }

  return 4;
};