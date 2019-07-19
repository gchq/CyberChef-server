export default function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }

    if (err instanceof TypeError) {
        res.status(400).send(err.message).end();
    } else {
        res.status(500).send(err.stack).end();
    }
};
