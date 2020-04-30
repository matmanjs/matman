import PageDriver from './model/PageDriver';
import { findMatmanConfig } from './util';
import { MATMAN_CONFIG_FILE } from './config';

export function createPageDriver(caseFilePath, opts) {
    const matmanConfig = findMatmanConfig(caseFilePath);

    if (!matmanConfig) {
        throw new Error(`Could not find ${MATMAN_CONFIG_FILE}!`);
    }

    return new PageDriver(matmanConfig, caseFilePath, opts);
}