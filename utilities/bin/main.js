"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
exports.default = (app) => {
    app
        .start()
        .then(() => {
        logger_1.default.info('Startup complete');
    })
        .catch((e) => {
        logger_1.default.error(e);
    });
    const signals = ['SIGHUP', 'SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
        process.on(signal, () => {
            shutdown(signal);
        });
    });
    const shutdown = (signal) => {
        logger_1.default.info(`Received a ${signal} signal. Attempting graceful shutdown...`);
        app.stop().finally(() => {
            logger_1.default.info(`Shutdown completed. Exiting.`);
            process.exit(0);
        });
    };
    process.on('uncaughtException', (err) => {
        logException('uncaughtException', err);
    });
    process.on('unhandledRejection', (err) => {
        logException('unhandledRejection', err);
    });
    function logException(type, err) {
        logger_1.default.error(type);
        logger_1.default.error(err);
    }
};
