import { Router } from "express";
import { Request, Response } from "express";
import { Collection, Endpoint } from "../models/db.type";

type Started = {};

export default class EndpointStarterService {
  static router: Router;

  private static instance: EndpointStarterService;

  private static startedCollection: Collection[] = [];

  private constructor() {}

  static getInstance() {
    if (!EndpointStarterService.instance) {
      this.instance = new EndpointStarterService();
    }
    return EndpointStarterService.instance;
  }

  public setRouter(router: Router) {
    EndpointStarterService.router = router;
  }

  public async startEndpoints(collection: Collection) {
    for (const endpoint of collection.endpoints) {
      try {
        if (
          typeof EndpointStarterService.router[endpoint.method] === "function"
        ) {
          const path: string =
            "/" +
            (collection.prefix ? collection.prefix + "/" : "") +
            endpoint.path;
          EndpointStarterService.router[endpoint.method](
            path,
            async (_req: Request, res: Response) => {
              res.status(endpoint.status).json(endpoint.response);
            }
          );
          console.log("api started: " + path);
        }
      } catch (err) {
        console.log(`Can't start endpoint ${JSON.stringify(endpoint)}: ${err}`);
      }
    }
  }
}
