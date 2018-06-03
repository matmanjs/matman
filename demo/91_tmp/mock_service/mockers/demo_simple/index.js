const Mocker = require('../../../../../src/mocker/Mocker');

let modules = [{
    name: 'error',
    hasConfig: false
}, {
    name: 'success',
    hasConfig: false
}];

module.exports = new Mocker(__dirname, {
    defaultName: 'demo_simple',
    modules: modules
});

