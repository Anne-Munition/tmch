"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const options = {};
exports.default = (logger) => {
    async function connect() {
        const url = getConnectionString();
        const { hostname, pathname } = new URL(url);
        await mongoose_1.default.connect(url, options);
        logger.info(`Connected to MongoDB: '${hostname}${pathname}'`);
    }
    async function disconnect() {
        await mongoose_1.default.disconnect();
        logger.info('Database connection closed');
    }
    function getConnectionString() {
        if (!process.env.MONGO_URL)
            throw new Error('Missing MONGO_URL');
        return process.env.MONGO_URL;
    }
    function isConnected() {
        return mongoose_1.default.connection.readyState === 1;
    }
    return {
        connect,
        disconnect,
        getConnectionString,
        isConnected,
    };
};
