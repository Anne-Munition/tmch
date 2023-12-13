"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (client, logger, esUrl) => {
    async function ping() {
        const { hostname, pathname } = new URL(esUrl);
        const response = await client.ping();
        if (!response)
            throw new Error(`Unable to connect to ElasticSearch server: '${hostname}${pathname}'`);
        logger.info(`Connected to ElasticSearch: '${hostname}'`);
    }
    return {
        ping,
    };
};
