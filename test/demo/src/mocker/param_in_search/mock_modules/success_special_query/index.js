module.exports = (params, req) => {
  // console.log('params', params);
  // console.log('req', req);

  return {
    "id": params.id,
    "type": params.type,
    "url": req.url,
  }
};