import { Router } from "express";
import formidable from "formidable";
const router = Router();
import { bake, Dish } from "cyberchef/src/node/index.mjs";

/**
 * bakePost
 */
router.post("/", async function bakePost(req, res, next) {
    if (req.is("multipart/form-data")) {
        bakeMultipartForm(req, res, next);
    } else {
        bakeBody(req, res, next);
    }
});

async function bakeMultipartForm(req, res, next) {
    const form = formidable();

    try {

        form.parse(req, async (err, fields, files) => {

            // req.log.warn(`Recipe: ${fields.recipe}`);
            // req.log.warn(`Input: ${files.input}`);
            // req.log.warn(`Other input: ${fields.input}`);
            if (err) {
                throw err;
            }

            if (!('recipe' in fields)) {
                throw new Error("Could not find required 'recipe' field in multipart form data");
            }

            let dish;

            // Case: data is in files.input
            if('input' in files) {
                // read the contents of the file and use it as an input
                res.json({ fields, files });
            } else if ('input' in fields) {

                dish = await bake(fields.input, fields.recipe);

            } else {
                throw new Error("Could not find 'input' field in multipart form data.");
            }

            // Attempt to translate to another type. Any translation errors
            // propagate through to the errorHandler.
            if ('outputType' in fields) {
                dish.get(req.body.outputType);
            }

            if (dish) {
                res.send({
                    value: dish.value,
                    type: Dish.enumLookup(dish.type),
                });
            }

        });

    } catch (e) {
        next(e);
    }
}

async function bakeBody(req, res, next) {

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
}

export default router;
