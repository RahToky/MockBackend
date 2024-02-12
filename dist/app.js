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
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const collection_route_1 = __importDefault(require("./routes/collection-route"));
const endpoint_route_1 = __importDefault(require("./routes/endpoint-route"));
const endpoint_starter_1 = __importDefault(require("./services/endpoint.starter"));
function configureApp() {
    return __awaiter(this, void 0, void 0, function* () {
        const myApp = (0, express_1.default)();
        // view engine setup
        myApp.set("views", path_1.default.join(__dirname, "../src/views"));
        myApp.set("view engine", "jade");
        myApp.use(express_1.default.json());
        myApp.use(express_1.default.urlencoded({ extended: false }));
        myApp.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
        /* API ROUTER */
        const endpointRouter = express_1.default.Router();
        const endpointStarter = endpoint_starter_1.default.getInstance().setRouter(endpointRouter);
        myApp.use("/api", endpointRouter);
        /* PAGE ROUTER */
        myApp.use("/collections", yield (0, collection_route_1.default)());
        myApp.use("/endpoints", yield (0, endpoint_route_1.default)());
        myApp.use("/", (_req, res) => res.redirect("/collections"));
        return myApp;
    });
}
exports.default = configureApp;
