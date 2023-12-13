"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const viewer_model_1 = __importDefault(require("./viewer_model"));
const lodash_1 = __importDefault(require("lodash"));
async function store(messages) {
    const items = lodash_1.default.uniqBy(messages, 'login').map((x) => {
        return {
            updateOne: {
                filter: { twitchId: x.user_id },
                update: {
                    $set: { login: x.login, displayName: x.display_name },
                    $addToSet: { names: { login: x.login, displayName: x.display_name } },
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
