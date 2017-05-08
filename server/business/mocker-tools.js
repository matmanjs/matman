import path from 'path';
import requireMockerModule from '../../mat/util/require-mocker-module';
import { getMockerJsonResult } from '../../mat/util/mocker-operation';

const ROOT_PROJECT = path.join(__dirname, '../../');
const ROOT_TEST = path.join(ROOT_PROJECT, './test');
const BASE_PATH_SRC = path.join(ROOT_TEST, './data/fixtures');

export function getMockerModuleResult() {
    const SRC_FILE = path.join(BASE_PATH_SRC, 'util/mocker-operation/return-plain-object.js');

    return getMockerJsonResult(requireMockerModule(SRC_FILE));
}

