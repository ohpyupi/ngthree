var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/daniel', function(req, res, next) {
  res.render('daniel');
});

router.get('/thingi', function(req, res, next) {
  res.render('thingi');
});

module.exports = router;
