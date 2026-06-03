import { Router } from "express";
const router = Router();
import { help } from "cyberchef";

/**
 * docsPost - Returns documentation for a specified operation
 */
router.post("/", async function docsPost(req, res, next) {
    try {
        const { operation } = req.body;
        const docs = help(operation);
        if (!docs) {
            res.send(`{No documentation for ${operation} found`);
            throw new Error(`No documentation found for operation: ${operation}`);
        }
        res.send(docs);
            } catch (error) {
        next(error);
    }
});

export default router;
