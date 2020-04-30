import PageDriver from './model/PageDriver';

export function createPageDriver(caseFilePath, opts) {
    return new PageDriver(caseFilePath, opts);
}