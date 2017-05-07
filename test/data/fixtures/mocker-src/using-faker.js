import faker from 'faker';

// http://marak.github.io/faker.js
const data = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    uid: faker.random.number()
};

// 导出
export default data;
// module.exports = data;