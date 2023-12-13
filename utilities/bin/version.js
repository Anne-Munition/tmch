"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const packageFile = process.env.NODE_ENV === 'production'
    ? path_1.default.join(process.cwd(), 'package.json')
    : path_1.default.join(process.cwd(), '../package.json');
let version;
try {
    const json = JSON.parse(fs_1.default.readFileSync(packageFile, { encoding: 'utf8' }));
    version = json.version || '0.0.0';
}
catch (e) {
    // Do Nothing
}
function default_1() {
    return version;
}
exports.default = default_1;
