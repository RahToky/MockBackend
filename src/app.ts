import path from "path";

import express, { Router, Request, Response } from "express";
import ApiService from "./services/api.service";
import configureCollectionPageRouter from "./routes/collection-route";
import configureEndpointPageRouter from "./routes/endpoint-route";

async function configureApp() {
  const myApp = express();

  // view engine setup
  myApp.set("views", path.join(__dirname, "../src/views"));
  myApp.set("view engine", "jade");

  myApp.use(express.json());
  myApp.use(express.urlencoded({ extended: false }));
  myApp.use(express.static(path.join(__dirname, "../public")));

  /* API ROUTER */
  const apiRouter = express.Router();
  await ApiService.getInstance().startMocking(apiRouter);
  myApp.use("/api", apiRouter);

  /* PAGE ROUTER */
  myApp.use(await configureCollectionPageRouter());
  myApp.use(await configureEndpointPageRouter());

  return myApp;
}

export default configureApp;
