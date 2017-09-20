// import path from 'path';
// import { expect } from 'chai';
// import fse from 'fs-extra';
//
// import { mocker } from '../../../src';
//
// const mockerDB = mocker.db;
//
// // 测试目标
// const TEST_TARGET = 'mocker/db.js';
//
// const ROOT_PROJECT = path.join(__dirname, '../../../');
// const ROOT_TEST = path.join(ROOT_PROJECT, './test');
//
// const TEST_SUB_PATH = path.dirname(TEST_TARGET);
// const BASE_PATH_SRC = path.join(ROOT_TEST, './data/fixtures', TEST_SUB_PATH);
// const BASE_PATH_TMP = path.join(ROOT_TEST, './tmp', TEST_SUB_PATH);
//
// // 以测试文件名为目录，将测试用的素材存储其中
// const FOLDER_NAME = path.basename(TEST_TARGET, '.js');
//
// describe(TEST_TARGET, () => {
//   const TMP_SAVE_FOLDER = path.join(BASE_PATH_TMP, FOLDER_NAME);
//
//   let db;
//
//   before(() => {
//     fse.removeSync(TMP_SAVE_FOLDER);
//
//     db = mockerDB.getDB(path.join(BASE_PATH_SRC, FOLDER_NAME, 'db.json'));
//   });
//
//   after(() => {
//     fse.removeSync(TMP_SAVE_FOLDER);
//   });
//
//   describe('getDB()', () => {
//
//     it('should return db object', () => {
//       expect(db).to.be.an('object');
//     });
//
//     it('db.getState() should exist', () => {
//       expect(db.getState()).to.be.an('object');
//     });
//
//   });
//
//   describe('getValue()', () => {
//
//     it('mockerDB.getValue(db, "name") return "mocker_name"', () => {
//       expect(mockerDB.getValue(db, "name")).to.equal('mocker_name');
//     });
//
//   });
//
//   describe('getActiveModule()', () => {
//
//     it('mockerDB.getActiveModule(db) return "1"', () => {
//       expect(mockerDB.getActiveModule(db)).to.equal('1');
//     });
//
//   });
//
//   describe('getActiveModule()', () => {
//
//     before(() => {
//       mockerDB.setActiveModule(db, '2');
//     });
//
//     after(() => {
//       mockerDB.setActiveModule(db, '1');
//     });
//
//     it('mockerDB.setActiveModule(db,"2") success', () => {
//       expect(mockerDB.getActiveModule(db)).to.equal('2');
//     });
//
//   });
//
// });
