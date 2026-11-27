import { OperationError, DishError } from "cyberchef";


/**
 * errorHandler
 *
 * Handle any errors that fall through the application. Lives at the end
 * of the function chain.
 *
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export default function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    // Errors raised by the body parsers (e.g. request too large, malformed
    // JSON) carry a client error status and are safe to expose.
    if (err.type === "entity.too.large") {
        res.status(413)
            .send(`Request body too large. The maximum size is ${err.limit} bytes.`)
            .end();
    } else if (err.expose && err.status >= 400 && err.status < 500) {
        res.status(err.status).send(err.message).end();
    } else if (
        err instanceof TypeError ||
        err instanceof OperationError ||
        err instanceof DishError
    ) {
        res.status(400).send(err.message).end();
    } else {
        req.log.error(err.stack);
        res.status(500).send("Internal Server Error").end();
    }
}
