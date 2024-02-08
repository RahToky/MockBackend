import { DatabaseStructure, Endpoint, Collection } from "../models/db.type";
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
      const defaultData: Collection[] = [
        {
          name: "Default",
          comment: "",
          prefix: "default",
          endpoints: [
            {
              name: "check api status",
              method: "get",
              path: "check",
              status: 200,
              response: { code: 200, message: "success" },
            },
            {
              name: "get error",
              method: "get",
              path: "error",
              status: 500,
              response: { code: 500, message: "error" },
            },
          ],
        },
        {
          name: "Users",
          comment: "package for users control",
          prefix: "users",
          endpoints: [
            {
              name: "getUsers",
              method: "get",
              path: "",
              status: 200,
              response: {
                code: 200,
                message: "success",
                data: ["rakoto", "naivo"],
              },
            },
          ],
        },
      ];
      this.db.insert(defaultData, (err: any, _newDocs: Collection[]) => {
        if (err) {
          console.error("Error on default insertion:", err);
        }
      });
    }
  }

  public async findAllCollection(): Promise<Collection[]> {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err: any, docs: Collection[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  }

  public async findAllEndpoints(): Promise<Endpoint[]> {
    const endpointPacks: Collection[] = await this.findAllCollection();
    return endpointPacks.flatMap((pack) => pack.endpoints);
  }
}
