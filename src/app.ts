import path from "path";

import express, { Router, Request, Response } from "express";
import ApiService from "./services/api.service";

async function configureApp() {
  const myApp = express();

  // view engine setup
  myApp.set("views", path.join(__dirname, "views"));
  myApp.set("view engine", "jade");

  myApp.use(express.json());
  myApp.use(express.urlencoded({ extended: false }));
  myApp.use(express.static(path.join(__dirname, "public")));

  const apiRouter = express.Router();
  await ApiService.getInstance().startMocking(apiRouter);
  myApp.use("/api", apiRouter);

  return myApp;
  // catch 404 and forward to error handler
  /*
myApp.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});*/

  // error handler
  /*
myApp.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});*/
}
export default configureApp;
