var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('*', function(req, res, next) {
  res.render(req.originalUrl.slice(1));
});

module.exports = router;
