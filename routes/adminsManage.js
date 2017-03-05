var express = require('express');
var router = express.Router();



/* GET Panel page. */
router.get('/', function(req, res, next) {
    res.render('adminsManage', { title: 'ממשק ניהול - מנהלים' });
});

module.exports = router;
