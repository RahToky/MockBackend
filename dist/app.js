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
const api_service_1 = __importDefault(require("./services/api.service"));
function configureApp() {
    return __awaiter(this, void 0, void 0, function* () {
        const myApp = (0, express_1.default)();
        // view engine setup
        myApp.set("views", path_1.default.join(__dirname, "views"));
        myApp.set("view engine", "jade");
        myApp.use(express_1.default.json());
        myApp.use(express_1.default.urlencoded({ extended: false }));
        myApp.use(express_1.default.static(path_1.default.join(__dirname, "public")));
        const apiRouter = express_1.default.Router();
        yield api_service_1.default.getInstance().startMocking(apiRouter);
        myApp.use("/api", apiRouter);
        return myApp;
        // catch 404 and forward to error handler
        /*
      myApp.use(function (req: Request, res: Response, next: NextFunction) {
        next(createError(404));
      });*/
        // error handler
        /*
      myApp.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "development" ? err : {};
      
        // render the error page
        res.status(err.status || 500);
        res.render("error");
      });*/
    });
}
exports.default = configureApp;
