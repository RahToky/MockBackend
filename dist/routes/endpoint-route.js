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
const endpointRouter = express_1.default.Router();
/**
 * HOME PAGE
 */
function configureEndpointPageRouter() {
    return __awaiter(this, void 0, void 0, function* () {
        const pageService = page_service_1.default.getInstance();
        endpointRouter.post("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const collectionId = req.body.collectionId;
            const type = req.body.type;
            const { _id, status, name, method, path, comment } = req.body;
            const response = req.body.response;
            const endpoint = {
                _id,
                status,
                name,
                method,
                path,
                comment,
                response: type === "text" ? response : JSON.parse(response),
            };
            if (endpoint._id) {
                yield pageService.updateEndpoint(collectionId, endpoint);
            }
            else {
                yield pageService.createEndpoint(collectionId, endpoint);
            }
            res.redirect("/");
        }));
        // SHOW FORM ENDPOINT
        endpointRouter.get("/:collectionId", (req, res) => {
            const collectionId = req.params.collectionId;
            res.render("endpoint-form", { collectionId });
        });
        return endpointRouter;
    });
}
exports.default = configureEndpointPageRouter;
