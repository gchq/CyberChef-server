import express from "express";
import cookieParser from "cookie-parser";
import pino from "express-pino-logger";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerDocument from "./swagger.js";
import errorHandler from "./lib/errorHandler.js";

// https://helmetjs.github.io/
import helmet from "helmet";

const swaggerSpec = swaggerJSDoc(swaggerDocument);

import indexRouter from "./routes/index";
import bakeRouter from "./routes/bake";

const app = express();

if (process.env.NODE_ENV === "production") {
    app.use(pino({
        level: "warn"
    }));
    app.use(helmet());
} else {
    app.use(pino({
        level: "debug",
        prettyPrint: true
    }));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/bake", bakeRouter);

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Error handling - place after all other middleware and routes
app.use(errorHandler);

export default app;
