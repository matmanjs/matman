module.exports = (db) => {
  return (req, res, next) => {
    db.write();
    next();
  }
};
