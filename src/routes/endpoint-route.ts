import express, { Request, Response, Router } from "express";
import PageService from "../services/page.service";
import { Endpoint } from "../models/db.type";

const endpointRouter = express.Router();

/**
 * HOME PAGE
 */
async function configureEndpointPageRouter() {
  const pageService: PageService = PageService.getInstance();

  endpointRouter.post("/", async (req: Request, res: Response) => {
    try {
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
    } finally {
      res.redirect("/");
    }
  });

  // SHOW FORM ENDPOINT
  endpointRouter.get("/:collectionId", (req: Request, res: Response) => {
    const collectionId = req.params.collectionId;
    res.render("endpoint-form", { collectionId });
  });

  // SHOW FORM ENDPOINT FOR EDITING
  endpointRouter.get(
    "/endpoints/:endpointId/collections/:collectionId/edit",
    (req: Request, res: Response) => {
      console.log("open edit endpoint page");
      const collectionId = req.params.collectionId;
      const endpointId = req.params.endpointId;
      pageService
        .findCollectionById(collectionId)
        .then((collection) => {
          if (!collection) {
            throw new Error("Collection not found");
          }
          const endpoints = collection.endpoints;
          if (!endpoints) {
            throw new Error("Not endpoints found in this collection");
          }
          const endpoint = endpoints.find((item) => item._id === endpointId);
          if (!endpoint) {
            throw new Error("Endpoint not found");
          }
          res.render("endpoint-form", { collectionId, endpoint });
        })
        .catch((error) => {
          console.log(error);
          res.redirect("/");
        });
    }
  );

  return endpointRouter;
}

export default configureEndpointPageRouter;
