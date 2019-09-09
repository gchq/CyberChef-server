import fs from "fs";
import YAML from "yaml"
import express from "express";
import cookieParser from "cookie-parser";
import pino from "express-pino-logger";
import swaggerUi from "swagger-ui-express";
import errorHandler from "./lib/errorHandler.js";

// https://helmetjs.github.io/
import helmet from "helmet";


import indexRouter from "./routes/index";
import bakeRouter from "./routes/bake";

const app = express();
app.disable("x-powered-by");


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
const swaggerFile = fs.readFileSync('./swagger.yml', 'utf8')
console.log(YAML.parse(swaggerFile));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(YAML.parse(swaggerFile)));


// Error handling - place after all other middleware and routes
app.use(errorHandler);

export default app;
