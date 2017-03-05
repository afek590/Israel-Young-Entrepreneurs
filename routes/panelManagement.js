var express = require('express');
var router = express.Router();



/* GET Panel page. */
router.get('/', function(req, res, next) {
    res.render('panelManagement', { title: 'ממשק ניהול' });
});

module.exports = router;
