const { Case, MatmanQuery } = require('../../../../src');

function getResult() {
  let matmanQuery = new MatmanQuery();

  matmanQuery.addOne('demo_01', 'success', false);
  matmanQuery.addOne('demo_02', 'success_1', false);
  matmanQuery.addOne('demo_03', 'success_2', false);

  return matmanQuery;
}

module.exports = getResult;
// module.exports = new Case(__dirname);