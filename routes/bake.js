import { Router } from "express"
const router = Router();
import { bake } from "cyberchef/src/node/index.mjs";

/**
 * @swagger
 * /bake:
 *    post:
 *      description: Bake something
 *      produces: application/json
 *      parameters: 
 *        - name: input
 *          description: input for the recipe
 *          required: true
 *          in: query
 *        - name: recipe
 *          description: recipe to bake with
 *          required: true
 *          in: query
 *      responses:
 *        default:
 *          description: something
 */
router.post('/', async function(req, res, next) {
  try {
    const dish = await bake(req.body.input, req.body.recipe);
    res.send(dish.value);
  } catch(e) {
    next(e);
  }

});

export default router;