import DBManager from "../db/db.manager";
import { Collection, Endpoint } from "../models/db.type";

export default abstract class DbService {
  db: Promise<DBManager>;

  constructor() {
    this.db = DBManager.getInstance();
  }

  async findAllCollection() {
    return (await this.db).findAllCollection();
  }

  async findCollectionById(id: string) {
    return (await this.db).findCollectionById(id);
  }

  async saveCollection(collection: Collection) {
    if (collection.prefix?.startsWith("/")) {
      collection.prefix = collection.prefix.substring(1);
    }
    if (collection._id) {
      (await this.db).updateCollection(collection);
    } else {
      (await this.db).createCollection(collection);
    }
  }

  async deleteCollection(collectionId: string) {
    (await this.db).deleteCollection(collectionId);
  }

  async createEndpoint(collectionId: string, endpoint: Endpoint) {
    if (endpoint.path.startsWith("/")) {
      endpoint.path = endpoint.path.substring(1);
    }
    (await this.db).createEndpoint(collectionId, endpoint);
  }

  async deleteEndpoint(collectionId: string, endpointId: string) {
    (await this.db).deleteEndpoint(collectionId, endpointId);
  }

  async updateEndpoint(collectionId: string, endpoint: Endpoint) {
    if (endpoint.path.startsWith("/")) {
      endpoint.path = endpoint.path.substring(1);
    }
    (await this.db).updateEndpoint(collectionId, endpoint);
  }
}
