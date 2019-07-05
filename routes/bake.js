const express = require('express');
const router = express.Router();

/* GET bake listing. */
router.post('/', function(req, res, next) {
  res.send('baking');
});

module.exports = router;
