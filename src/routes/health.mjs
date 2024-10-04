import { Router } from "express";
const router = Router();

/**
 * bakePost
 */
router.get("/", async function healthGet(req, res, next) {
    const healthcheck = {
        uptime: process.uptime(),
        message: "OK",
        timestamp: new Date().toString()
    };
    try {
        res.send(healthcheck);
    } catch (error) {
        healthcheck.message = error;
        req.log.error(`Healthcheck failed with error: ${error}`);
        res.status(503).send();
    }
});

export default router;
