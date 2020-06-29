const path = require('path');
const sayHello = require('./demo_test_call');

// 假设这个是 test.js 文件
sayHello();
console.log('\n');
sayHello(path.join(__dirname, './demo_case_module.js'));
