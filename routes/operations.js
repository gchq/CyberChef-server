import { Router } from "express";
const router = Router();
import { operations } from "cyberchef/src/node/index.mjs";

/**
 * operationsGet
 */
router.get("/", async function (req, res, next) {
    const ret = {};
    for (const op of operations) {
        if (op.opName) ret[op.opName] = op.args;
    }
    res.send(ret);
});

export default router;
