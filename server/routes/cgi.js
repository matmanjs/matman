import { getMockerModuleResult } from '../business/mocker-tools';

var express = require('express');
var router = express.Router();

/* GET cgi listing. */
router.get('/', function (req, res, next) {
    res.render('cgi');
});

router.get('/get_mocker_list', function (req, res, next) {

    getMockerModuleResult()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.send(err);
        });

});

module.exports = router;
