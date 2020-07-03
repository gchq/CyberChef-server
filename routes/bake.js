import fs from "fs";
import { promisify } from "util";

import { Router } from "express";
import formidable from "formidable";

import { bake, Dish } from "cyberchef/src/node/index.mjs";

const router = Router();
const readFile = promisify(fs.readFile);

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

/**
 * bakeMultipartForm
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function bakeMultipartForm(req, res, next) {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
        try {

            if (err) {
                throw err;
            }

            if (!("recipe" in files)) {
                throw new TypeError("Could not find required 'recipe' attachment in multipart form data");
            }

            let recipe;
            try {
                const fileContents = await readFile(files.recipe.path);
                recipe = JSON.parse(fileContents);
            } catch (e) {
                throw new TypeError(`Could not parse recipe file: ${e}`);
            }

            let dish;

            if ("input" in files) {
                const input = await readFile(files.input.path);
                dish = await bake(input, recipe);

            } else if ("input" in fields) {
                dish = await bake(fields.input, recipe);

            } else {
                throw new TypeError("Could not find 'input' field in multipart form data.");
            }

            if (dish) {

                if ("outputType" in fields) {
                    // dish.get takes a typeEnum
                    let typeEnum = parseInt(fields.outputType, 10);
                    if (isNaN(typeEnum)) {
                        typeEnum = Dish.typeEnum(fields.outputType);
                    }
                    dish.get(typeEnum);

                    // Browser should handle files as a download
                    if (typeEnum === Dish.FILE) {
                        res.set("Content-Disposition", "attachment");
                    }
                }

                res.send({
                    value: dish.value,
                    type: Dish.enumLookup(dish.type),
                });
            }

        } catch (e) {
            next(e);
        }

    });
}

/**
 * bakeBody
 * @param {} req
 * @param {*} res
 * @param {*} next
 */
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
