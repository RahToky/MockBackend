import express, { Request, Response, Router } from "express";
import PageService from "../services/page.service";
import { Endpoint } from "../models/db.type";

const endpointRouter = express.Router();

/**
 * HOME PAGE
 */
async function configureEndpointPageRouter() {
  const pageService: PageService = PageService.getInstance();

  // SHOW FORM ENDPOINT
  endpointRouter.get("/:collectionId", (req: Request, res: Response) => {
    const collectionId = req.params.collectionId;
    res.render("endpoint-form", { collectionId });
  });

  // SHOW FORM ENDPOINT FOR EDITING
  endpointRouter.get(
    "/:endpointId/collections/:collectionId/edit",
    (req: Request, res: Response) => {
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

  endpointRouter.post("/", async (req: Request, res: Response) => {
    try {
      const collectionId: string = req.body.collectionId;
      const type: string = req.body.type;
      const { _id, status, name, method, path, comment }: Endpoint = req.body;
      const response = req.body.response;
      const endpoint: Endpoint = {
        status,
        name,
        method,
        path,
        comment,
        response: type === "text" ? (response as string) : JSON.parse(response),
      };
      await pageService.createEndpoint(collectionId, endpoint);
    } catch (error) {
      console.log(error);
    } finally {
      res.redirect("/");
    }
  });

  //UPDATE ENDPOINT
  endpointRouter.put("/", async (req: Request, res: Response) => {
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
      await pageService.updateEndpoint(collectionId, endpoint);
    } catch (error) {
      console.log(error);
    } finally {
      res.redirect("/");
    }
  });

  return endpointRouter;
}

export default configureEndpointPageRouter;
