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
const db_manager_1 = __importDefault(require("../db/db.manager"));
class DbService {
    constructor() {
        this.db = db_manager_1.default.getInstance();
    }
    findAllCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.db).findAllCollection();
        });
    }
    findCollectionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.db).findCollectionById(id);
        });
    }
    saveCollection(collection) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if ((_a = collection.prefix) === null || _a === void 0 ? void 0 : _a.startsWith("/")) {
                collection.prefix = collection.prefix.substring(1);
            }
            return (yield this.db).createCollection(collection);
        });
    }
    updateCollection(collection) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if ((_a = collection.prefix) === null || _a === void 0 ? void 0 : _a.startsWith("/")) {
                collection.prefix = collection.prefix.substring(1);
            }
            return (yield this.db).updateCollection(collection);
        });
    }
    deleteCollection(collectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.db).deleteCollection(collectionId);
        });
    }
    createEndpoint(collectionId, endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            if (endpoint.path.startsWith("/")) {
                endpoint.path = endpoint.path.substring(1);
            }
            return (yield this.db).createEndpoint(collectionId, endpoint);
        });
    }
    deleteEndpoint(collectionId, endpointId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.db).deleteEndpoint(collectionId, endpointId);
        });
    }
    updateEndpoint(collectionId, endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            if (endpoint.path.startsWith("/")) {
                endpoint.path = endpoint.path.substring(1);
            }
            return (yield this.db).updateEndpoint(collectionId, endpoint);
        });
    }
}
exports.default = DbService;
