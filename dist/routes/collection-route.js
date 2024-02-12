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
const collectionRouter = express_1.default.Router();
/**
 * HOME PAGE
 */
function configureCollectionPageRouter() {
    return __awaiter(this, void 0, void 0, function* () {
        const pageService = page_service_1.default.getInstance();
        collectionRouter.get("/", index);
        // HOME PAGE
        function index(_req, res) {
            pageService
                .findAllCollection()
                .then((collections) => res.render("index", { collections }));
        }
        // CONFIRM FORM ADD
        collectionRouter.post("/", (req, res) => {
            const collection = req.body;
            pageService.saveCollection(collection).then((_) => {
                res.redirect("/");
            });
        });
        // SHOW FORM PAGE
        collectionRouter.get("/add", (_req, res) => {
            res.render("collection-form");
        });
        // START Collection's endpoint
        collectionRouter.get("/start");
        return collectionRouter;
    });
}
exports.default = configureCollectionPageRouter;
