var express = require('express');
var router = express.Router();

/* GET cgi listing. */
router.get('/', function(req, res, next) {
    res.render('cgi');
});

module.exports = router;
