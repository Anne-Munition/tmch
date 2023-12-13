"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const viewer_model_1 = __importDefault(require("./viewer_model"));
async function store(messages) {
    const items = messages.map((x) => {
        return {
            updateOne: {
                filter: { twitchId: x.message.user_id },
                update: {
                    $set: { login: x.message.login, displayName: x.message.display_name },
                    $addToSet: { names: { login: x.message.login, displayName: x.message.display_name } },
                },
                upsert: true,
            },
        };
    });
    // @ts-expect-error $addToSet
    return viewer_model_1.default.collection.bulkWrite(items);
}
exports.default = {
    store,
};
