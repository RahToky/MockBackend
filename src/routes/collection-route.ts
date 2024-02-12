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
    pageService
      .findAllCollection()
      .then((collections) => res.render("index", { collections }));
  }

  // CONFIRM FORM ADD
  collectionRouter.post("/", (req: Request, res: Response) => {
    const collection: Collection = req.body;
    pageService.saveCollection(collection).then((_) => {
      res.redirect("/");
    });
  });

  // SHOW FORM PAGE
  collectionRouter.get("/add", (_req: Request, res: Response) => {
    res.render("collection-form");
  });

  // START Endpoints in collection
  collectionRouter.get(
    "/start/:collectionId",
    async (req: Request, res: Response) => {
      const collection = await pageService.findCollectionById(
        req.params.collectionId
      );
      if (collection) {
        endpointStarter.startEndpoints(collection);
        res.json({ code: 200, message: "success" });
      } else {
        res.json({ code: 500, message: "failed" });
      }
    }
  );

  return collectionRouter;
}

export default configureCollectionPageRouter;
