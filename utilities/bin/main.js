"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app, logger) => {
    app
        .start()
        .then(() => {
        logger.info('Startup complete');
    })
        .catch((e) => {
        logger.error(e);
    });
    const signals = ['SIGHUP', 'SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
        process.on(signal, () => {
            shutdown(signal);
        });
    });
    const shutdown = (signal) => {
        logger.info(`Received a ${signal} signal. Attempting graceful shutdown...`);
        app.stop().finally(() => {
            logger.info(`Shutdown completed. Exiting.`);
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
        logger.error(type);
        logger.error(err);
    }
};
