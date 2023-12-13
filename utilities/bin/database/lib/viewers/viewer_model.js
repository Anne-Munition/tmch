"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    twitchId: { type: String, unique: true },
    login: String,
    displayName: String,
    names: Array,
});
exports.default = (0, mongoose_1.model)('viewers', schema);
