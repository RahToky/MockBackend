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
                this.db.insert(defaultData, (err, _newDocs) => {
                    if (err) {
                        console.error("Error on default insertion:", err);
                    }
                });
            }
        });
    }
    findAllEndpointPacks() {
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
    findAllEndpoints() {
        return __awaiter(this, void 0, void 0, function* () {
            const endpointPacks = yield this.findAllEndpointPacks();
            return endpointPacks.flatMap((pack) => pack.endpoints);
        });
    }
}
exports.default = DBManager;
