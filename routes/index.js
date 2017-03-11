var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'יזמים צעירים ישראל',
  logo: '/images/logo.jpg',
  address: 'כתובת מיקוד עיר'});
});

module.exports = router;
