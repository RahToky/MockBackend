import { DatabaseStructure, Endpoint, EndpointPack } from "../models/db.type";
import Datastore from "nedb";

export default class DBManager {
  private db;

  private static instance: DBManager;

  private constructor() {
    this.db = new Datastore({
      filename: "mock.backend.db",
      autoload: true,
      corruptAlertThreshold: 1,
    });
  }

  public static async getInstance(): Promise<DBManager> {
    if (!DBManager.instance) {
      DBManager.instance = new DBManager();
      await DBManager.instance.insertDefaultDataIfEmpty();
    }
    return DBManager.instance;
  }

  private async isDBEmpty(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.count({}, (err, count) => {
        if (err) {
          reject(err);
        } else {
          resolve(count === 0);
        }
      });
    });
  }

  async insertDefaultDataIfEmpty(): Promise<void> {
    const isEmpty = await this.isDBEmpty();
    if (isEmpty) {
      const defaultData: EndpointPack[] = [
        {
          package: "Default",
          comment: "",
          prefix: "default",
          endpoints: [
            {
              method: "get",
              path: "check",
              status: 200,
              response: { code: 200, message: "success" },
            },
          ],
        },
      ];
      this.db.insert(defaultData, (err: any, _newDocs: EndpointPack[]) => {
        if (err) {
          console.error("Error on default insertion:", err);
        }
      });
    }
  }

  public async findAllEndpointPacks(): Promise<EndpointPack[]> {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err: any, docs: EndpointPack[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  }

  public async findAllEndpoints(): Promise<Endpoint[]> {
    const endpointPacks: EndpointPack[] = await this.findAllEndpointPacks();
    return endpointPacks.flatMap((pack) => pack.endpoints);
  }
}
