const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const bakeRouter = require("./routes/bake");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/bake", bakeRouter);

module.exports = app;
