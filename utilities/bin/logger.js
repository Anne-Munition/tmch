"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = void 0;
const winston_1 = require("winston");
require("winston-daily-rotate-file");
const path_1 = __importDefault(require("path"));
const { combine, timestamp, colorize, printf } = winston_1.format;
const logDir = path_1.default.join(process.cwd(), 'logs');
const enumerateErrorFormat = (0, winston_1.format)((info) => {
    if (info.message instanceof Error) {
        info.message = Object.assign({
            message: info.message.message,
            stack: info.message.stack,
        }, info.message);
    }
    if (info instanceof Error) {
        return Object.assign({
            message: info.message,
            stack: info.stack,
        }, info);
    }
    return info;
});
const logFormat = printf((info) => {
    const log = `${info.timestamp} ${info.level} ${info.message}`;
    return info.stack ? `${log}\n${info.stack}` : log;
});
const logger = (0, winston_1.createLogger)({
    format: combine(timestamp(), enumerateErrorFormat(), logFormat),
    transports: [
        new winston_1.transports.DailyRotateFile({
            level: 'info',
            dirname: logDir,
            filename: '%DATE%-combined.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxFiles: '30d',
        }),
        new winston_1.transports.DailyRotateFile({
            level: 'error',
            dirname: logDir,
            filename: '%DATE%-error.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxFiles: '30d',
        }),
        new winston_1.transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            format: combine(timestamp(), enumerateErrorFormat(), colorize(), logFormat),
        }),
    ],
});
exports.default = logger;
class MyStream {
    logFormat = printf((info) => {
        return `${info.timestamp} ${info.message}`;
    });
    logger = (0, winston_1.createLogger)({
        format: combine(timestamp(), this.logFormat),
        transports: [
            new winston_1.transports.DailyRotateFile({
                level: 'info',
                dirname: logDir,
                filename: '%DATE%-http.log',
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxFiles: '30d',
            }),
        ],
    });
    write(text) {
        this.logger.info(text.trim());
    }
}
exports.stream = new MyStream();
