"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConnected = exports.disconnect = exports.connect = exports.getUrl = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../logger"));
const options = {};
function getUrl() {
    if (!process.env.MONGO_URL)
        throw new Error('Missing MONGO_URL');
    return process.env.MONGO_URL;
}
exports.getUrl = getUrl;
async function connect() {
    const url = getUrl();
    const { hostname, pathname } = new URL(url);
    await mongoose_1.default.connect(url, options);
    logger_1.default.info(`Connected to MongoDB: '${hostname}${pathname}'`);
}
exports.connect = connect;
async function disconnect() {
    await mongoose_1.default.disconnect();
    logger_1.default.info('Database connection closed');
}
exports.disconnect = disconnect;
function isConnected() {
    return mongoose_1.default.connection.readyState === 1;
}
exports.isConnected = isConnected;
