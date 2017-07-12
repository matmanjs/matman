"use strict";

module.exports = function (db) {
  return function (req, res, next) {
    db.write();
    next();
  };
};
//# sourceMappingURL=write.js.map