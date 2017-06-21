module.exports = (params, req) => {
  // console.log('params', params);
  // console.log('req', req);

  return {
    "id": params.id,
    "subId": params.subId,
    "url": req.url,
  }
};