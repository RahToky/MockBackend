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
        endpointRouter.post("/endpoints", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const endpoint = req.body;
            const collectionId = req.body.collectionId;
            console.log("collectionId=" + collectionId);
            console.log("endpoint=" + JSON.stringify(endpoint));
            /*let endpoint:Endpoint|null = null;
            if (endpoint.id) {
              await pageService.updateEndpoint(collectionId, endpoint);
            } else {
              await pageService.createEndpoint(collectionId, endpoint);
            }*/
            res.redirect("/");
        }));
        // SHOW FORM ENDPOINT
        endpointRouter.get("/endpoints/:collectionId", (req, res) => {
            const collectionId = req.params.collectionId;
            res.render("endpoint-form", { collectionId });
        });
        return endpointRouter;
    });
}
exports.default = configureEndpointPageRouter;
