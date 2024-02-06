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
class ApiService {
    constructor() {
        this.db = db_manager_1.default.getInstance();
    }
    static getInstance() {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }
    startMocking(router) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const endpointPacks = yield (yield this.db).findAllEndpointPacks();
                for (const pack of endpointPacks) {
                    for (const endpoint of pack.endpoints) {
                        try {
                            if (typeof router[endpoint.method] === "function") {
                                const path = "/" + (pack.prefix ? pack.prefix + "/" : "") + endpoint.path;
                                router[endpoint.method](path, (_req, res) => __awaiter(this, void 0, void 0, function* () {
                                    res.status(endpoint.status).json(endpoint.response);
                                }));
                            }
                        }
                        catch (err) {
                            console.log(`Can't create endpoint ${JSON.stringify(endpoint)}: ${err}`);
                        }
                    }
                }
            }
            catch (err) {
                console.log(`Error on startMocking: ${err}`);
            }
        });
    }
}
exports.default = ApiService;
