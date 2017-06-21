// export default function getResult(param, req) {
//   console.log('param', param);
//   console.log('req', req);
//
//   return {
//     "id": -1,
//   }
// }

module.exports = (params, req) => {
  console.log('params', params);
  // console.log('req', req);

  return {
    "id": params.id,
  }
};