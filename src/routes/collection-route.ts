import express, { Request, Response, Router } from "express";
import PageService from "../services/page.service";
import { Collection, Endpoint } from "../models/db.type";
import EndpointStarterService from "../services/endpoint.starter";

const collectionRouter = express.Router();

/**
 * HOME PAGE
 */
async function configureCollectionPageRouter() {
  const pageService: PageService = PageService.getInstance();
  const endpointStarter = EndpointStarterService.getInstance();

  collectionRouter.get("/", index);

  // HOME PAGE
  function index(_req: Request, res: Response) {
    const startedCollectionIds =
      EndpointStarterService.getStartedCollections.flatMap(
        (item) => item.collectionId
      );
    pageService
      .findAllCollection()
      .then((collections) => {
        if (collections && collections.length > 0) {
          res.render("index", {
            collections,
            startedCollectionIds,
          });
        } else {
          res.redirect("/collections/add");
        }
      })
      .catch((_) =>
        res.render("index", {
          collections: [],
          startedCollectionIds: [],
        })
      );
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
        res.redirect("/");
      });
  });

  // CONFIRM FORM ADD
  collectionRouter.post("/", (req: Request, res: Response) => {
    console.log("ppooooost");
    const collection: Collection = req.body;
    pageService
      .saveCollection(collection)
      .then((_) => {
        res.redirect("/");
      })
      .catch((error) => {
        console.log(error);
        res.redirect("/");
      });
  });

  // CONFIRM FORM ADD
  collectionRouter.put("/", (req: Request, res: Response) => {
    console.log("update");
    const collection: Collection = req.body;
    pageService
      .updateCollection(collection)
      .then((_) => {
        res.redirect("/");
      })
      .catch((error) => {
        console.log(error);
        res.redirect("/");
      });
  });

  // SHOW ADD FORM PAGE
  collectionRouter.get("/add", (_req: Request, res: Response) => {
    res.render("collection-form");
  });

  // START Endpoints in collection
  collectionRouter.get(
    "/:collectionId/start",
    async (req: Request, res: Response) => {
      const collection = await pageService
        .findCollectionById(req.params.collectionId)
        .then((collection) => {
          if (collection) {
            endpointStarter
              .startOrStopEndpoints(collection)
              .then((message) => res.json({ code: 200, message }));
          } else {
            res.json({ code: 404, message: "collection not found" });
          }
        })
        .catch((error) => res.json({ code: 500, message: error }));
    }
  );

  return collectionRouter;
}

export default configureCollectionPageRouter;
