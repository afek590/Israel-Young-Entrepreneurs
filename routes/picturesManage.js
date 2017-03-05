var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('picturesManage', { title: 'ממשק ניהול - תמונות' });
});

module.exports = router;
