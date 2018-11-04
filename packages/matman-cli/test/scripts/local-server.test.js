// const request = require('superagent');
// const { expect } = require('chai');
//
// describe('local-server', () => {
//   describe('check /matman-cgi/mocker', () => {
//     let data;
//
//     before(function () {
//       return request
//         .get('http://localhost:9527/matman-cgi/mocker')
//         .then((response) => {
//           data = JSON.parse(response.res.text);
//           // console.log(data);
//         });
//     });
//
//     it('should return array and length is 3', () => {
//       expect(data).to.be.a('array').and.have.lengthOf(3);
//     });
//
//     it('should exist demo_03', () => {
//       let filterResult = data.filter(item => item.name === 'demo_03');
//       let target = filterResult[0];
//
//       expect(filterResult).to.be.a('array').and.have.lengthOf(1);
//       expect(target.mockModuleList).to.be.a('array').and.have.lengthOf(3);
//       expect(target.config).to.eql({
//         name: 'demo_03',
//         route: '/cgi-bin/a/b/demo_03',
//         routeExtra: {},
//         description: 'description for demo_03',
//         disable: false,
//         defaultModule: 'success_1',
//         activeModule: 'success_1',
//         method: 'get',
//         priority: 0,
//         tags: ['全部', 'tag1', 'tag2']
//       });
//     });
//   });
//
//   describe('check /matman-cgi/mocker/:mockerName ', () => {
//     let data;
//
//     before(function () {
//       return request
//         .get('http://localhost:9527/matman-cgi/mocker/demo_03')
//         .then((response) => {
//           data = JSON.parse(response.res.text);
//           // console.log(data);
//         });
//     });
//
//     it('should return object', () => {
//       expect(data).to.be.a('object').and.have.all.keys('basePath', 'name', 'mockModuleList', 'config');
//     });
//
//     it('should exist target.mockModuleList', () => {
//       expect(data.mockModuleList).to.be.a('array').and.have.lengthOf(3);
//     });
//
//     it('should exist target.config', () => {
//       expect(data.config).to.eql({
//         name: 'demo_03',
//         route: '/cgi-bin/a/b/demo_03',
//         routeExtra: {},
//         description: 'description for demo_03',
//         disable: false,
//         defaultModule: 'success_1',
//         activeModule: 'success_1',
//         method: 'get',
//         priority: 0,
//         tags: ['全部', 'tag1', 'tag2']
//       });
//     });
//   });
//
//   describe('return active module result', () => {
//     let data;
//
//     before(function () {
//       return request
//         .get('http://localhost:9527/cgi-bin/a/b/demo_03')
//         .then((response) => {
//           data = JSON.parse(response.res.text);
//           // console.log(data);
//         });
//     });
//
//     it('should return correct data', () => {
//       expect(data).to.eql({
//         'retcode': 0,
//         'result': {
//           'result': 1,
//           'other': 'demo_03_other'
//         }
//       });
//     });
//   });
//
//   describe('return target mock module result', () => {
//     let data;
//
//     before(function () {
//       return request
//         .get('http://localhost:9527/cgi-bin/a/b/demo_03?_m_target=success_2')
//         .then((response) => {
//           data = JSON.parse(response.res.text);
//           // console.log(data);
//         });
//     });
//
//     it('should return correct data', () => {
//       expect(data).to.eql({
//         'retcode': 0,
//         'result': {
//           'result': 2,
//           'other': 'demo_03_other'
//         }
//       });
//     });
//   });
//
//   describe('return readme content', () => {
//     it('should exist content', () => {
//       return request
//         .get('http://localhost:9527/matman-cgi/mocker/demo_03/readme')
//         .then((response) => {
//           let data = JSON.parse(response.res.text);
//           expect(data.html).to.have.lengthOf.at.least(100);
//         });
//     });
//
//     it('should be empty', () => {
//       return request
//         .get('http://localhost:9527/matman-cgi/mocker/demo_01/readme')
//         .then((response) => {
//           let data = JSON.parse(response.res.text);
//           expect(data.html).to.be.empty;
//         });
//     });
//   });
//
//   describe('check static resource', () => {
//
//     it('should support jpg ', () => {
//       return request
//         .get('http://localhost:9527/matman-admin/mockers/demo_03/static/logo.jpg')
//         .then((response) => {
//
//           expect(response.status).to.equal(200);
//           expect(response.type).to.equal('image/jpeg');
//           expect(response.body.length).to.equal(2615);
//         });
//     });
//
//     it('should support subdir and png', () => {
//       return request
//         .get('http://localhost:9527/matman-admin/mockers/demo_03/static/sub/workflow.png')
//         .then((response) => {
//
//           expect(response.status).to.equal(200);
//           expect(response.type).to.equal('image/png');
//           expect(response.body.length).to.equal(21869);
//         });
//     });
//
//   });
// });