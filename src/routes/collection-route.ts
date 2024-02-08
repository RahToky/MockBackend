import express, { Request, Response, Router } from "express";
import PageService from "../services/page.service";

const collectionRouter = express.Router();

/**
 * HOME PAGE
 */
async function configureCollectionPageRouter() {
  const pageService: PageService = PageService.getInstance();

  collectionRouter.get("/", index);
  collectionRouter.get("/collections", index);

  // HOME PAGE
  function index(_req: Request, res: Response) {
    pageService
      .findAllCollection()
      .then((collections) => res.render("index", { collections }));
  }

  // CONFIRM FORM ADD
  collectionRouter.post("/collections", (req: Request, res: Response) => {
    const { id, name, prefix, comment } = req.body;
    console.log(`${id} ${name} ${prefix} ${comment}`);
    res.redirect("/index");
  });

  // SHOW FORM PAGE
  collectionRouter.get("/collections/add", (_req: Request, res: Response) => {
    res.render("collection-form");
  });

  return collectionRouter;
}

export default configureCollectionPageRouter;
