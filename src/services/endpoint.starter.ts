import { Router } from "express";
import { Request, Response } from "express";
import { Collection, Endpoint } from "../models/db.type";

type StartedEndpoint = {
  collectionId: string | undefined;
  endpoints: Endpoint[];
};

export default class EndpointStarterService {
  static router: Router;

  private static instance: EndpointStarterService;

  private static startedCollections: StartedEndpoint[] = [];

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

  public static get getStartedCollections(): ReadonlyArray<StartedEndpoint> {
    return this.startedCollections;
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
        }
        const index = EndpointStarterService.startedCollections.findIndex(
          (item) => item.collectionId === collection._id
        );
        if (index !== -1) {
          EndpointStarterService.startedCollections[index] = {
            collectionId: collection._id,
            endpoints: collection.endpoints,
          };
        } else {
          EndpointStarterService.startedCollections.push({
            collectionId: collection._id,
            endpoints: collection.endpoints,
          });
        }
      } catch (err) {
        console.log(`Can't start endpoint ${JSON.stringify(endpoint)}: ${err}`);
      }
    }
  }
}
