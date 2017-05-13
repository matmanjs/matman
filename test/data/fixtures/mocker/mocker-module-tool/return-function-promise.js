import Promise from 'bluebird';

export default function getData() {
    return Promise.resolve({
        name: 'return-function-promise',
        age: 16
    });
}