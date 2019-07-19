import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerDocument from "./swagger.js"

// https://helmetjs.github.io/
import helmet from "helmet";

const swaggerSpec = swaggerJSDoc(swaggerDocument);


import indexRouter from "./routes/index";
import bakeRouter from "./routes/bake";

const app = express();

if (process.env.NODE_ENV === 'production') {
    app.use(logger("tiny"));
    app.use(helmet());
} else {
    app.use(logger("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/bake", bakeRouter);

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


export default app;
