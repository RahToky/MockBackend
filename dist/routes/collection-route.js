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
const express_1 = __importDefault(require("express"));
const page_service_1 = __importDefault(require("../services/page.service"));
const endpoint_starter_1 = __importDefault(require("../services/endpoint.starter"));
const custom_exception_1 = __importDefault(require("../models/custom.exception"));
const collectionRouter = express_1.default.Router();
/**
 * HOME PAGE
 */
function configureCollectionPageRouter() {
    return __awaiter(this, void 0, void 0, function* () {
        const pageService = page_service_1.default.getInstance();
        const endpointStarter = endpoint_starter_1.default.getInstance();
        collectionRouter.get("/", index);
        // HOME PAGE
        function index(_req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const startedCollectionIds = endpoint_starter_1.default.getStartedCollections.flatMap((item) => item.collectionId);
                    const collections = yield pageService.findAllCollection();
                    if (!collections || collections.length === 0) {
                        throw new Error("Empty collection");
                    }
                    res.render("index", {
                        collections,
                        startedCollectionIds,
                    });
                }
                catch (error) {
                    console.log(error);
                    res.redirect("/collections/add");
                }
            });
        }
        // DELETE COLLECTION
        collectionRouter.delete("/:collectionId", (req, res) => {
            const collectionId = req.params.collectionId;
            pageService
                .deleteCollection(collectionId)
                .then((_) => {
                res.json({ code: 200, message: "success" });
            })
                .catch((error) => {
                res.json({ code: 500, message: error });
            });
        });
        // SHOW EDIT FORM PAGE
        collectionRouter.get("/:collectionId/edit", (req, res) => {
            const collectionId = req.params.collectionId;
            pageService
                .findCollectionById(collectionId)
                .then((collection) => res.render("collection-form", { collection }))
                .catch((error) => {
                console.log(error);
                res.redirect("/");
            });
        });
        // CONFIRM FORM ADD
        collectionRouter.post("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const collection = req.body;
                yield pageService.saveCollection(collection);
            }
            catch (error) {
                console.log(error);
            }
            finally {
                res.redirect("/");
            }
        }));
        // CONFIRM FORM ADD
        collectionRouter.put("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const collection = req.body;
                yield pageService.updateCollection(collection);
            }
            catch (error) {
                console.log(error);
            }
            finally {
                res.redirect("/");
            }
        }));
        // SHOW ADD FORM PAGE
        collectionRouter.get("/add", (_req, res) => {
            res.render("collection-form");
        });
        // START Endpoints in collection
        collectionRouter.get("/:collectionId/start", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const collection = yield pageService.findCollectionById(req.params.collectionId);
                if (!collection) {
                    throw new custom_exception_1.default(404, "Collection not found");
                }
                const message = yield endpointStarter.startOrStopEndpoints(collection);
                res.json({ code: 200, message });
            }
            catch (error) {
                console.log(error);
                if (error instanceof custom_exception_1.default) {
                    res.json({ code: error.code, message: error.message });
                }
                else {
                    res.json({ code: 500, message: error });
                }
            }
        }));
        return collectionRouter;
    });
}
exports.default = configureCollectionPageRouter;
