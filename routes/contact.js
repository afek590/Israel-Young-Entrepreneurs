var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('contact', { title: 'יזמים צעירים ישראל - צור קשר' });
});

module.exports = router;
