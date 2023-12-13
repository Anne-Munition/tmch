"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uptime = exports.version = void 0;
const version_1 = __importDefault(require("./version"));
const uptime_1 = __importDefault(require("./uptime"));
exports.version = version_1.default;
exports.uptime = uptime_1.default;
