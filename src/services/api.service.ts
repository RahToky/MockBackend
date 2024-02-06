import { Router } from "express";
import DBManager from "../db/db.manager";
import { EndpointPack } from "../models/db.type";
import { Request, Response } from "express";

export default class ApiService {
  private db: Promise<DBManager>;
  private static instance: ApiService;

  private constructor() {
    this.db = DBManager.getInstance();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public async startMocking(router: Router): Promise<void> {
    try {
      const endpointPacks: EndpointPack[] = await (
        await this.db
      ).findAllEndpointPacks();
      for (const pack of endpointPacks) {
        for (const endpoint of pack.endpoints) {
          try {
            if (typeof router[endpoint.method] === "function") {
              const path: string =
                "/" + (pack.prefix ? pack.prefix + "/" : "") + endpoint.path;
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
