import express, { Request, Response, Router } from "express";
import PageService from "../services/page.service";

const endpointRouter = express.Router();

/**
 * HOME PAGE
 */
async function configureEndpointPageRouter() {
  const pageService: PageService = PageService.getInstance();

  // SHOW FORM ENDPOINT
  endpointRouter.get("/endpoints/add", (_req: Request, res: Response) => {
    pageService
      .findAllCollection()
      .then((collections) => res.render("endpint-form", { collections }));
  });

  return endpointRouter;
}

export default configureEndpointPageRouter;
