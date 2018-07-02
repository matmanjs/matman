module.exports = (params, req) => {
    return new Promise((resolve, reject) => {
        // Do something here ...

        setTimeout(() => {
            resolve({
                name: 'return-function-promise',
                age: 16
            });
        }, 1000);
    });
};