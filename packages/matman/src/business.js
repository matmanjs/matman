import PageDriver from './model/PageDriver';
import { findMatmanConfig } from './util';
import { MATMAN_CONFIG_FILE } from './config';

/**
 * 创建 pageDriver
 *
 * @param {String} caseFilePath 当前 case 的文件名
 * @param {Object} [opts] 额外参数，可以传递给 matman config
 * @return {PageDriver}
 */
export function createPageDriver(caseFilePath, opts) {
    const matmanConfig = findMatmanConfig(caseFilePath, opts);

    if (!matmanConfig) {
        throw new Error(`Could not find ${MATMAN_CONFIG_FILE}!`);
    }

    return new PageDriver(matmanConfig, caseFilePath, opts);
}