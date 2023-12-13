"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const version_1 = __importDefault(require("./version"));
const uptime_1 = __importDefault(require("./uptime"));
const logger_1 = __importDefault(require("./logger"));
const database_1 = __importDefault(require("./database"));
const elastic_1 = __importStar(require("./elastic"));
const viewer_service_1 = __importDefault(require("./database/lib/viewers/viewer_service"));
const main_1 = __importDefault(require("./main"));
exports.default = {
    version: version_1.default,
    uptime: uptime_1.default,
    logger: logger_1.default,
    database: database_1.default,
    elastic: elastic_1.default,
    ViewerService: viewer_service_1.default,
    main: main_1.default,
    parser: elastic_1.tmiMessage,
    getIndex: elastic_1.getIndex,
};
