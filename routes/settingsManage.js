var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('settingsManage', { title: 'ממשק ניהול - הגדרות כלליות' });
});

module.exports = router;
