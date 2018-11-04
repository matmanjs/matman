module.exports = function (source, inputSourceMap) {
    this.cacheable && this.cacheable();

    let callback = this.async();

    let code = `
        window.matman_ver=${Date.now()};
    `;

    callback(null, code + source);
};