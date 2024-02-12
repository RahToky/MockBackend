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
    static get getStartedCollections() {
        return this.startedCollections;
    }
    startOrStopEndpoints(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const index = EndpointStarterService.startedCollections.findIndex((item) => item.collectionId === collection._id);
                let routes = [];
                // already started
                if (index !== -1) {
                    routes = EndpointStarterService.router.stack;
                    EndpointStarterService.startedCollections =
                        EndpointStarterService.startedCollections.filter((item) => item.collectionId !== collection._id);
                }
                else {
                    EndpointStarterService.startedCollections.push({
                        collectionId: collection._id,
                        endpoints: collection.endpoints,
                    });
                }
                for (const endpoint of collection.endpoints) {
                    try {
                        const path = `/${collection.prefix ? collection.prefix + "/" : ""}${endpoint.path}`;
                        if (index !== -1) {
                            routes.forEach((route, index, routes) => {
                                if (route.route && route.route.path === path) {
                                    routes.splice(index, 1);
                                }
                            });
                        }
                        else if (typeof EndpointStarterService.router[endpoint.method] === "function") {
                            EndpointStarterService.router[endpoint.method](path, (_req, res) => __awaiter(this, void 0, void 0, function* () {
                                res
                                    .status(typeof endpoint.status === "string"
                                    ? parseInt(endpoint.status)
                                    : endpoint.status)
                                    .json(endpoint.response);
                            }));
                        }
                    }
                    catch (err) {
                        console.log(`Can't ${index !== -1 ? "stop" : "start"} endpoint ${JSON.stringify(endpoint)}: ${err}`);
                    }
                }
                return index !== -1 ? "stoped" : "started";
            }
            catch (ex) {
                console.log(ex);
                return ex;
            }
        });
    }
}
EndpointStarterService.startedCollections = [];
exports.default = EndpointStarterService;
