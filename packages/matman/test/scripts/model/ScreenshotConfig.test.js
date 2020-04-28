import path from 'path';
import { expect } from 'chai';

import ScreenshotConfig from '../../../src/model/ScreenshotConfig';

describe('check model/ScreenshotConfig.js', () => {
    describe('check constructor(opts, basePath, tag)', () => {
        const MATMAN_ROOT_PATH = path.join(__dirname, '../../data/fixtures/baidu_01');
        const BASE_PATH = path.join(MATMAN_ROOT_PATH, './src/page_baidu_index/cases/basic-check');

        it('if opts is Boolean and tag is undefined', () => {
            expect(new ScreenshotConfig(true, BASE_PATH)).to.eql({
                path: path.join(MATMAN_ROOT_PATH, './build/screenshot/page_baidu_index_cases/basic-check.png'),
                tag: undefined
            });
        });

        it('if opts is Boolean and tag is "mytag"', () => {
            expect(new ScreenshotConfig(true, BASE_PATH, 'mytag')).to.eql({
                path: path.join(MATMAN_ROOT_PATH, './build/screenshot/page_baidu_index_cases/basic-check_mytag.png'),
                tag: 'mytag'
            });
        });

        it('if opts is String(relative path) and tag is "mytag"', () => {
            expect(new ScreenshotConfig('./is/relative/file', BASE_PATH, 'mytag')).to.eql({
                path: path.join(BASE_PATH, './is/relative/file'),
                tag: 'mytag'
            });
        });

        it('if opts is String(absolute path) and tag is "mytag"', () => {
            expect(new ScreenshotConfig('/is/absolute/file', BASE_PATH, 'mytag')).to.eql({
                path: '/is/absolute/file',
                tag: 'mytag'
            });
        });
    });
});

