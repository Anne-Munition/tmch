"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const http_terminator_1 = require("http-terminator");
const logger_1 = __importDefault(require("./logger"));
let httpTerminator;
exports.default = (app) => {
    function start() {
        const server = new http_1.Server(app);
        const port = process.env.PORT || 3000;
        httpTerminator = (0, http_terminator_1.createHttpTerminator)({ server });
        server.listen(port);
        logger_1.default.info(`Listening on port: ${port}`);
    }
    async function stop() {
        if (httpTerminator)
            httpTerminator
                .terminate()
                .then(() => {
                logger_1.default.info('Server connections closed');
            })
                .catch(() => { });
    }
    return {
        start,
        stop,
    };
};
