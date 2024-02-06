#!/usr/bin/env node
"use strict";
/**
 * Module dependencies.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
/**
 * Get port from environment and store in Express.
 */
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}
var port = normalizePort(process.env.PORT || "1104");
(0, app_1.default)().then((myApp) => {
    myApp.set("port", port);
    /**
     * Create HTTP server.
     */
    var server = http_1.default.createServer(myApp);
    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);
    /**
     * Normalize a port into a number, string, or false.
     */
    /**
     * Event listener for HTTP server "error" event.
     */
    function onError(error) {
        if (error.syscall !== "listen") {
            throw error;
        }
        const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
        // handle specific listen errors with friendly messages
        switch (error.code) {
            case "EACCES":
                console.error(bind + " requires elevated privileges");
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(bind + " is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
    /**
     * Event listener for HTTP server "listening" event.
     */
    function onListening() {
        var addr = server.address();
        var bind = typeof addr === "string" ? "pipe " + addr : "port " + (addr === null || addr === void 0 ? void 0 : addr.port);
        console.log("Listening on " + bind);
    }
});
