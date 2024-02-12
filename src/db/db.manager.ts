import { Endpoint, Collection } from "../models/db.type";
import Datastore from "nedb";
import { v4 as uuidv4 } from "uuid";

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
              _id: uuidv4(),
              name: "check api status",
              method: "get",
              path: "check",
              status: 200,
              response: "OK",
            },
            {
              _id: uuidv4(),
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
              _id: uuidv4(),
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

  /*=======================================================*\
   *                C O L L E C T I O N S
  \*=======================================================*/
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

  // FIND COLLECTION BY ID
  async findCollectionById(collectionId: string): Promise<Collection | null> {
    return new Promise((resolve, reject) => {
      this.db.findOne(
        { _id: collectionId },
        (err: any, doc: Collection | null) => {
          if (err) {
            reject(err);
          } else {
            resolve(doc);
          }
        }
      );
    });
  }

  // ADD COLLECTION
  public async createCollection(collection: Collection): Promise<void> {
    collection._id = uuidv4();
    collection.endpoints = [];
    return new Promise((resolve, reject) => {
      this.db.insert(collection, (err: any, _newDoc: Collection) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // UPDATE COLLECTION
  public async updateCollection(collection: Collection): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: collection._id },
        collection,
        {},
        (err: any, _numReplaced: number) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // DELETE COLLECTION
  public async deleteCollection(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: id }, {}, (err: any, _numRemoved: number) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /*=======================================================*\
   *                    E N D P O I N T S
  \*=======================================================*/
  public async findAllEndpoints(): Promise<Endpoint[]> {
    const collections: Collection[] = await this.findAllCollection();
    return collections.flatMap((pack) => pack.endpoints);
  }

  // ADD ENDPOINT
  public async createEndpoint(
    collectionId: string,
    endpoint: Partial<Endpoint>
  ): Promise<void> {
    endpoint._id = uuidv4();
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: collectionId }, // Sélectionne la collection spécifique à mettre à jour
        { $push: { endpoints: { $each: [endpoint] } } }, // Ajoute le nouvel endpoint à la liste existante d'endpoints de cette collection
        {}, // Pour s'assurer que seule la première correspondance est mise à jour
        (err: any, numUpdated: number) => {
          if (err) {
            reject(err);
          } else if (numUpdated === 0) {
            reject(new Error("La collection spécifiée n'existe pas"));
          } else {
            resolve();
          }
        }
      );
    });
  }

  // DELETE ENDPOINT
  public async deleteEndpoint(
    collectionId: string,
    endpointId: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: collectionId },
        { $pull: { endpoints: { _id: endpointId } } },
        {},
        (err: any, _numReplaced: number) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // UPDATE ENDPOINT
  public async updateEndpoint(
    collectionId: string,
    updatedEndpoint: Partial<Endpoint>
  ): Promise<void> {}
}
