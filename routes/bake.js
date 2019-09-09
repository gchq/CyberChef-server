import { Router } from "express";
const router = Router();
import { bake } from "cyberchef/src/node/index.mjs";

/**
 * bakePost
 */
router.post("/", async function bakePost(req, res, next) {
    try {
        if (!req.body.input) {
            throw new TypeError("'input' property is required in request body");
        }

        if (!req.body.recipe) {
            throw new TypeError("'recipe' property is required in request body");
        }

        const dish = await bake(req.body.input, req.body.recipe);
        res.send(dish.value);
    } catch (e) {
        next(e);
    }
});

export default router;
