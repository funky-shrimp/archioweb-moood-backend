import express from "express";
import createError from "http-errors";
import logger from "morgan";
import mongoose from "mongoose";

import * as config from "./config.js";

import indexRouter from "./src/routes/index.js";

import apiRouter from "./src/routes/apiRouter.js";

const app = express();

mongoose.connect(config.database_url || "mongdb://localhost/your-app-name").catch((err) => {
  console.error("MongoDB connection error:", err);
});



app.use(function myMiddleware(req, res, next) {
  console.log('Hello World!');
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Send the error status
  res.status(err.status || 500);
  res.send(err.message);
});

export default app;
