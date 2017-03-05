var express = require('express');
var router = express.Router();



/* GET Panel page. */
router.get('/', function(req, res, next) {
    res.render('videosManage', { title: 'ממשק ניהול - וידאו' });
});

module.exports = router;
