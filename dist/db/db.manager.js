"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nedb_1 = __importDefault(require("nedb"));
const uuid_1 = require("uuid");
class DBManager {
    constructor() {
        this.db = new nedb_1.default({
            filename: "mock.backend.db",
            autoload: true,
            corruptAlertThreshold: 1,
        });
    }
    static getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!DBManager.instance) {
                DBManager.instance = new DBManager();
                yield DBManager.instance.insertDefaultDataIfEmpty();
            }
            return DBManager.instance;
        });
    }
    isDBEmpty() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.db.count({}, (err, count) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(count === 0);
                    }
                });
            });
        });
    }
    insertDefaultDataIfEmpty() {
        return __awaiter(this, void 0, void 0, function* () {
            const isEmpty = yield this.isDBEmpty();
            if (isEmpty) {
                const defaultData = [
                    {
                        name: "Default",
                        comment: "",
                        prefix: "default",
                        endpoints: [
                            {
                                _id: (0, uuid_1.v4)(),
                                name: "check api status",
                                method: "get",
                                path: "check",
                                status: 200,
                                response: "OK",
                            },
                            {
                                _id: (0, uuid_1.v4)(),
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
                                _id: (0, uuid_1.v4)(),
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
                this.db.insert(defaultData, (err, _newDocs) => {
                    if (err) {
                        console.error("Error on default insertion:", err);
                    }
                });
            }
        });
    }
    /*=======================================================*\
     *                C O L L E C T I O N S
    \*=======================================================*/
    findAllCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.db.find({}, (err, docs) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(docs);
                    }
                });
            });
        });
    }
    // FIND COLLECTION BY ID
    findCollectionById(collectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.db.findOne({ _id: collectionId }, (err, doc) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(doc);
                    }
                });
            });
        });
    }
    // ADD COLLECTION
    createCollection(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            collection._id = (0, uuid_1.v4)();
            collection.endpoints = [];
            return new Promise((resolve, reject) => {
                this.db.insert(collection, (err, _newDoc) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
    // UPDATE COLLECTION
    updateCollection(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.db.update({ _id: collection._id }, {
                    $set: {
                        name: collection.name,
                        comment: collection.comment,
                        prefix: collection.prefix,
                    },
                }, {}, (err, numReplaced) => {
                    if (err) {
                        reject(err);
                    }
                    else if (numReplaced === 0) {
                        reject("Update collection failed");
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
    // DELETE COLLECTION
    deleteCollection(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.db.remove({ _id: id }, {}, (err, numRemoved) => {
                    if (err) {
                        reject(err);
                    }
                    else if (numRemoved === 0) {
                        reject(new Error("collection not found"));
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
    /*=======================================================*\
     *                    E N D P O I N T S
    \*=======================================================*/
    findAllEndpoints() {
        return __awaiter(this, void 0, void 0, function* () {
            const collections = yield this.findAllCollection();
            return collections.flatMap((pack) => pack.endpoints);
        });
    }
    // ADD ENDPOINT
    createEndpoint(collectionId, endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            endpoint._id = (0, uuid_1.v4)();
            return new Promise((resolve, reject) => {
                this.db.update({ _id: collectionId }, { $push: { endpoints: { $each: [endpoint] } } }, {}, (err, numUpdated) => {
                    if (err) {
                        reject(err);
                    }
                    else if (numUpdated === 0) {
                        reject(new Error("collection not found"));
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
    // DELETE ENDPOINT
    deleteEndpoint(collectionId, endpointId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.db.update({ _id: collectionId }, { $pull: { endpoints: { _id: endpointId } } }, {}, (err, numReplaced) => {
                    if (err) {
                        reject(err);
                    }
                    else if (numReplaced === 0) {
                        reject("Deletion failed");
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
    // UPDATE ENDPOINT
    updateEndpoint(collectionId, updatedEndpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.findCollectionById(collectionId)
                    .then((collection) => {
                    if (!collection) {
                        throw new Error("Collection not found");
                    }
                    else {
                        for (const index in collection.endpoints) {
                            const endpoint = collection.endpoints[index];
                            if (endpoint._id === updatedEndpoint._id) {
                                collection.endpoints[index] = Object.assign(Object.assign({}, collection.endpoints[index]), updatedEndpoint);
                                this.db.update({ _id: collection._id }, {
                                    $set: { endpoints: collection.endpoints },
                                }, {}, (err, numReplaced) => {
                                    if (err) {
                                        reject(err);
                                    }
                                    else if (numReplaced === 0) {
                                        reject("Update endpoint failed");
                                    }
                                    else {
                                        resolve();
                                    }
                                });
                            }
                        }
                    }
                })
                    .catch((error) => {
                    reject(error);
                });
            });
        });
    }
}
exports.default = DBManager;
