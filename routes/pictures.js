var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('pictures', { title: 'יזמים צעירים ישראל - תמונות'});
});

module.exports = router;
