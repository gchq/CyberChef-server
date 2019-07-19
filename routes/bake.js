const express = require('express');
const router = express.Router();
const chef = require("cyberchef");

/* GET bake listing. */
router.post('/', async function(req, res, next) {
  const dish = await chef.bake(req.body.input, req.body.recipe);

  res.send(dish.value);
});

module.exports = router;
