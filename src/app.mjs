import fs from "fs";
import YAML from "yaml";
import express from "express";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import errorHandler from "./lib/errorHandler.mjs";
import cors from "cors";
import logger from "pino-http";

// https://helmetjs.github.io/
import helmet from "helmet";

import bakeRouter from "./routes/bake.mjs";
import magicRouter from "./routes/magic.mjs";
import healthRouter from "./routes/health.mjs";

const app = express();
app.disable("x-powered-by");


app.use(cors({
    origin: "*"
}));

if (process.env.NODE_ENV === "production") {
    app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
    app.use(logger({
        level: "error",
    }));
} else {
    app.use(logger({
        level: "info"
    }));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// Swagger docs
const swaggerFile = fs.readFileSync("./swagger.yml", "utf8");

// Routes
app.use("/health", healthRouter);
app.use("/bake", bakeRouter);
app.use("/magic", magicRouter);


// Default route
app.use("/", swaggerUi.serve);
app.get("/", swaggerUi.setup(YAML.parse(swaggerFile)));


// Error handling - place after all other middleware and routes
app.use(errorHandler);

export default app;
