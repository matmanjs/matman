function testPromise() {
    return Promise.reject('testPromisexxx');
}

function testNormal() {
    return 'testNormal';
}

const testData = 'testData';
const testPromiseData = Promise.resolve('testPromiseData');

Promise.resolve(testPromise()).then((data) => {
    console.log('\n', data);
}).catch((e)=>{
    console.log('\n', e);
})

Promise.resolve(testNormal()).then((data) => {
    console.log('\n', data);
});

Promise.resolve(testData).then((data) => {
    console.log('\n', data);
});

Promise.resolve(testPromiseData).then((data) => {
    console.log('\n', data);
});