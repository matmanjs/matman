import faker from 'faker';

// http://marak.github.io/faker.js
// https://cdn.rawgit.com/Marak/faker.js/master/examples/browser/index.html
const data = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    uid: faker.random.number()
};

export default data;