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

  public async startOrStopEndpoints(
    collection: Collection
  ): Promise<"started" | "stoped" | unknown> {
    try {
      const index = EndpointStarterService.startedCollections.findIndex(
        (item) => item.collectionId === collection._id
      );
      let routes = [];

      // already started
      if (index !== -1) {
        routes = EndpointStarterService.router.stack;
        EndpointStarterService.startedCollections =
          EndpointStarterService.startedCollections.filter(
            (item) => item.collectionId !== collection._id
          );
      } else {
        EndpointStarterService.startedCollections.push({
          collectionId: collection._id,
          endpoints: collection.endpoints,
        });
      }

      for (const endpoint of collection.endpoints) {
        try {
          const path: string = `/${
            collection.prefix ? collection.prefix + "/" : ""
          }${endpoint.path}`;

          if (index !== -1) {
            routes.forEach((route, index, routes) => {
              if (route.route && route.route.path === path) {
                routes.splice(index, 1);
              }
            });
          } else if (
            typeof EndpointStarterService.router[endpoint.method] === "function"
          ) {
            EndpointStarterService.router[endpoint.method](
              path,
              async (_req: Request, res: Response) => {
                res
                  .status(
                    typeof endpoint.status === "string"
                      ? parseInt(endpoint.status)
                      : endpoint.status
                  )
                  .json(endpoint.response);
              }
            );
          }
        } catch (err) {
          console.log(
            `Can't ${index !== -1 ? "stop" : "start"} endpoint ${JSON.stringify(
              endpoint
            )}: ${err}`
          );
        }
      }
      return index !== -1 ? "stoped" : "started";
    } catch (ex) {
      console.log(ex);
      return ex;
    }
  }
}
