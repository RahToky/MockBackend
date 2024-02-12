import path from "path";

import express, { Router, Request, Response } from "express";
import configureCollectionPageRouter from "./routes/collection-route";
import configureEndpointPageRouter from "./routes/endpoint-route";
import EndpointStarterService from "./services/endpoint.starter";

async function configureApp() {
  const myApp = express();

  // view engine setup
  myApp.set("views", path.join(__dirname, "../src/views"));
  myApp.set("view engine", "jade");

  myApp.use(express.json());
  myApp.use(express.urlencoded({ extended: false }));
  myApp.use(express.static(path.join(__dirname, "../public")));

  /* API ROUTER */
  const endpointRouter = express.Router();
  const endpointStarter =
    EndpointStarterService.getInstance().setRouter(endpointRouter);
  myApp.use("/api", endpointRouter);

  /* PAGE ROUTER */
  myApp.use("/collections", await configureCollectionPageRouter());
  myApp.use("/endpoints", await configureEndpointPageRouter());
  myApp.use("/", (_req: Request, res: Response) =>
    res.redirect("/collections")
  );

  return myApp;
}

export default configureApp;
