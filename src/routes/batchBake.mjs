import { Router } from "express";
const router = Router();
import { bake, Dish } from "cyberchef";

/**
 * batchBakePost
 */
router.post("/", async function batchBakePost(req, res, next) {
    try {
        if (!req.body.input || !Array.isArray(req.body.input)) {
            throw new TypeError("'input' property of type 'Array' is required in request body");
        }

        if (req.body.input.length === 0) {
            throw new TypeError("'input' array must be non-empty");
        }

        if (!req.body.recipe) {
            throw new TypeError("'recipe' property is required in request body");
        }

        // Results are objects with a result param if the result of the bake on the data
        // item was successful and and error param if not that contains the string exception
        // Result also contains the type, in line with the single bake endpoint
        const retArr = req.body.input.map((input) => {
            try {
                const dish = bake(input, req.body.recipe);
                let retVal = dish.value;
                // Attempt to translate to another type. Any translation errors
                // propagate through to the errorHandler.
                if (req.body.outputType) {
                    retVal = dish.get(req.body.outputType);
                }
                return {
                    success: true,
                    value: retVal,
                    type: Dish.enumLookup(dish.type),
                };
            } catch (err) {
                // Chef uses TypeError to indicate a problem with recipes. Safe to assume that a bad recipe
                // will be a showstopper for all data so use the global error handler to handle this.
                if (err instanceof TypeError) {
                    req.log.error("Bad recipe");
                    // Rethrow to activate the outer try/catch and exit the handling of this request
                    throw err;
                }
                return {
                    success: false,
                    error: err.message,
                };
            }
        });

        res.send(retArr);

    } catch (e) {
        next(e);
    }
});

export default router;
