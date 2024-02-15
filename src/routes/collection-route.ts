import express, { Request, Response, Router } from "express";
import PageService from "../services/page.service";
import { Collection, Endpoint } from "../models/db.type";
import EndpointStarterService from "../services/endpoint.starter";
import CodedError from "../models/custom.exception";

const collectionRouter = express.Router();

/**
 * HOME PAGE
 */
async function configureCollectionPageRouter() {
  const pageService: PageService = PageService.getInstance();
  const endpointStarter = EndpointStarterService.getInstance();

  collectionRouter.get("/", index);

  // HOME PAGE
  async function index(_req: Request, res: Response) {
    try {
      const startedCollectionIds =
        EndpointStarterService.getStartedCollections.flatMap(
          (item) => item.collectionId
        );
      const collections = await pageService.findAllCollection();

      if (!collections || collections.length === 0) {
        throw new Error("Empty collection");
      }

      res.render("index", {
        collections,
        startedCollectionIds,
      });
    } catch (error) {
      console.log(error);
      res.redirect("/collections/add");
    }
  }

  // DELETE COLLECTION
  collectionRouter.delete("/:collectionId", (req: Request, res: Response) => {
    const collectionId = req.params.collectionId;
    pageService
      .deleteCollection(collectionId)
      .then((_) => {
        res.json({ code: 200, message: "success" });
      })
      .catch((error) => {
        res.json({ code: 500, message: error });
      });
  });

  // SHOW EDIT FORM PAGE
  collectionRouter.get("/:collectionId/edit", (req: Request, res: Response) => {
    const collectionId = req.params.collectionId;
    pageService
      .findCollectionById(collectionId)
      .then((collection) => res.render("collection-form", { collection }))
      .catch((error) => {
        console.log(error);
        res.redirect("/");
      });
  });

  // CONFIRM FORM ADD
  collectionRouter.post("/", async (req: Request, res: Response) => {
    try {
      const collection: Collection = req.body;
      await pageService.saveCollection(collection);
    } catch (error) {
      console.log(error);
    } finally {
      res.redirect("/");
    }
  });

  // CONFIRM FORM ADD
  collectionRouter.put("/", async (req: Request, res: Response) => {
    try {
      const collection: Collection = req.body;
      await pageService.updateCollection(collection);
    } catch (error) {
      console.log(error);
    } finally {
      res.redirect("/");
    }
  });

  // SHOW ADD FORM PAGE
  collectionRouter.get("/add", (_req: Request, res: Response) => {
    res.render("collection-form");
  });

  // START Endpoints in collection
  collectionRouter.get(
    "/:collectionId/start",
    async (req: Request, res: Response) => {
      try {
        const collection = await pageService.findCollectionById(req.params.collectionId);
        if (!collection) {
          throw new CodedError(404, "Collection not found");
        }

        const message: string | unknown = await endpointStarter.startOrStopEndpoints(collection);
        res.json({ code: 200, message });
      } catch (error) {
        console.log(error);
        if (error instanceof CodedError) {
          res.json({ code: error.code, message: error.message });
        } else {
          res.json({ code: 500, message: error });
        }
      }
    }
  );

  return collectionRouter;
}

export default configureCollectionPageRouter;
