"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("./service"));
class PageService extends service_1.default {
    constructor() {
        super();
    }
    static getInstance() {
        if (!PageService.instance) {
            PageService.instance = new PageService();
        }
        return PageService.instance;
    }
}
exports.default = PageService;
