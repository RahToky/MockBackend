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
    const collectionId: string = req.body.collectionId;
    const type: string = req.body.type;
    const { _id, status, name, method, path, comment }: Endpoint = req.body;
    const response = req.body.response;
    const endpoint: Endpoint = {
      _id,
      status,
      name,
      method,
      path,
      comment,
      response: type === "text" ? (response as string) : JSON.parse(response),
    };
    if (endpoint._id) {
      await pageService.updateEndpoint(collectionId, endpoint);
    } else {
      await pageService.createEndpoint(collectionId, endpoint);
    }
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
