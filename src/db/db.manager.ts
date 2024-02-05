import { DatabaseStructure, Endpoint } from "../models/db.model";
import low from "lowdb";
import { JSONFilePreset } from "lowdb/node";

export default class DBManager {
  private db;
  private defaultData: DatabaseStructure = { endpoints: [] };

  private static instance: DBManager;

  private constructor() {
    this.db = JSONFilePreset<DatabaseStructure>("db.json", this.defaultData);
  }

  public static getInstance(): DBManager {
    if (!DBManager.instance) {
      DBManager.instance = new DBManager();
    }
    return DBManager.instance;
  }

  public async findAllEndpoints(): Promise<Endpoint[]> {
    return (await this.db).data.endpoints;
  }
}
