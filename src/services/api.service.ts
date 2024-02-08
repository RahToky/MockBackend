import { Router } from "express";
import DBManager from "../db/db.manager";
import { Collection } from "../models/db.type";
import { Request, Response } from "express";
import DbService from "./service";

export default class ApiService extends DbService {
  private static instance: ApiService;

  private constructor() {
    super();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public async startMocking(router: Router): Promise<void> {
    try {
      const collections: Collection[] = await this.findAllCollection();
      for (const collection of collections) {
        for (const endpoint of collection.endpoints) {
          try {
            if (typeof router[endpoint.method] === "function") {
              const path: string =
                "/" +
                (collection.prefix ? collection.prefix + "/" : "") +
                endpoint.path;
              router[endpoint.method](
                path,
                async (_req: Request, res: Response) => {
                  res.status(endpoint.status).json(endpoint.response);
                }
              );
            }
          } catch (err) {
            console.log(
              `Can't create endpoint ${JSON.stringify(endpoint)}: ${err}`
            );
          }
        }
      }
    } catch (err) {
      console.log(`Error on startMocking: ${err}`);
    }
  }
}
