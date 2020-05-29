import { Router } from "express";
const router = Router();
import { bake, Dish } from "cyberchef/src/node/index.mjs";

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

        // Attempt to translate to another type. Any translation errors
        // propagate through to the errorHandler.
        if (req.body.outputType) {
            dish.get(req.body.outputType);
        }

        res.send({
            value: dish.value,
            type: Dish.enumLookup(dish.type),
        });

    } catch (e) {
        next(e);
    }
});


router.get("/", async function bakeGet(req, res, next) {
    try {

        if (!req.query.input) {
            throw new TypeError("'input' query parameter is required");
        }

        if (!req.query.recipe) {
            throw new TypeError("'recipe' query parameter is required");
        }

        // base64 decode the input
        const inputBuffer = Buffer.from(req.query.input, "base64");

        const dish = await bake(inputBuffer, req.query.recipe);

        // If the dish output is binary data, base64 encode it to send
        // over the wire.
        let encodedDishValue;
        if (dish.type === Dish.ARRAY_BUFFER) {
            encodedDishValue = Buffer.from(dish.value).toString("base64");
        }

        res.send({
            value: encodedDishValue || dish.value,
            type: Dish.enumLookup(dish.type),
        });

    } catch (e) {
        next(e);
    }
});

export default router;
