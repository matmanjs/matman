module.exports = {
  getPage
};

function getPage(array, page, perPage) {
  let obj = {};
  let start = (page - 1) * perPage;
  let end = page * perPage;

  obj.items = array.slice(start, end);
  if (obj.items.length === 0) {
    return obj;
  }

  if (page > 1) {
    obj.prev = page - 1;
  }

  if (end < array.length) {
    obj.next = page + 1;
  }

  if (obj.items.length !== array.length) {
    obj.current = page;
    obj.first = 1;
    obj.last = Math.ceil(array.length / perPage);
  }

  return obj;
}
