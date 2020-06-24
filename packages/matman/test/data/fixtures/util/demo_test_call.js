const sayHello = require('./demo_case_module');

module.exports = referFile => {
  // 假设这个是另外一个中介
  console.log(sayHello(referFile));
};
