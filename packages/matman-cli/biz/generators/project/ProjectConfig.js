module.exports = class ProjectConfig {
    constructor(opts) {
        this.projectName = '';
        this.pkgVersion = opts.pkgVersion;
    }

    updateByAnswer(opts) {
        this.projectName = opts.projectName;

    }
};
