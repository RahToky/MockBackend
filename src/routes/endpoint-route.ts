import express, { Request, Response, Router } from "express";
import PageService from "../services/page.service";
import { Endpoint } from "../models/db.type";

const endpointRouter = express.Router();

/**
 * HOME PAGE
 */
async function configureEndpointPageRouter() {
  const pageService: PageService = PageService.getInstance();

  endpointRouter.post("/endpoints", async (req: Request, res: Response) => {
    const endpoint: Endpoint = req.body;
    const collectionId: string = req.body.collectionId;

    console.log("collectionId=" + collectionId);
    console.log("endpoint=" + JSON.stringify(endpoint));
    /*let endpoint:Endpoint|null = null;
    if (endpoint.id) {
      await pageService.updateEndpoint(collectionId, endpoint);
    } else {
      await pageService.createEndpoint(collectionId, endpoint);
    }*/
    res.redirect("/");
  });

  // SHOW FORM ENDPOINT
  endpointRouter.get(
    "/endpoints/:collectionId",
    (req: Request, res: Response) => {
      const collectionId = req.params.collectionId;
      res.render("endpoint-form", { collectionId });
    }
  );

  return endpointRouter;
}

export default configureEndpointPageRouter;
