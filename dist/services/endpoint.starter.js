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
Object.defineProperty(exports, "__esModule", { value: true });
class EndpointStarterService {
    constructor() { }
    static getInstance() {
        if (!EndpointStarterService.instance) {
            this.instance = new EndpointStarterService();
        }
        return EndpointStarterService.instance;
    }
    setRouter(router) {
        EndpointStarterService.router = router;
    }
    startEndpoints(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const endpoint of collection.endpoints) {
                try {
                    if (typeof EndpointStarterService.router[endpoint.method] === "function") {
                        const path = "/" +
                            (collection.prefix ? collection.prefix + "/" : "") +
                            endpoint.path;
                        EndpointStarterService.router[endpoint.method](path, (_req, res) => __awaiter(this, void 0, void 0, function* () {
                            res.status(endpoint.status).json(endpoint.response);
                        }));
                        console.log("api started: " + path);
                    }
                }
                catch (err) {
                    console.log(`Can't start endpoint ${JSON.stringify(endpoint)}: ${err}`);
                }
            }
        });
    }
}
EndpointStarterService.startedCollection = [];
exports.default = EndpointStarterService;
