import Promise from 'bluebird';

function getData() {
    return Promise.resolve({
        name: 'return-promise',
        age: 16
    });
}

const result = getData();

export default result;