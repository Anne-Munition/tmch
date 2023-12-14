"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkIndexTmi = exports.getIndex = exports.tmiMessage = exports.ping = exports.init = exports.getUrl = void 0;
const elasticsearch_1 = require("@elastic/elasticsearch");
const logger_1 = __importDefault(require("./logger"));
let client;
function getUrl() {
    if (!process.env.ES_URL)
        throw new Error('Missing ES_URL');
    return process.env.ES_URL;
}
exports.getUrl = getUrl;
function init() {
    client = new elasticsearch_1.Client({
        node: getUrl(),
        /*auth: {
          username: process.env.ES_USERNAME as string,
          password: process.env.ES_PASSWORD as string,
        },*/
    });
}
exports.init = init;
async function ping() {
    const { hostname, pathname } = new URL(getUrl());
    const response = await client.ping();
    if (!response)
        throw new Error(`Unable to connect to ElasticSearch server: '${hostname}${pathname}'`);
    logger_1.default.info(`Connected to ElasticSearch: '${hostname}'`);
}
exports.ping = ping;
function tmiMessage(msg) {
    for (const tag in msg.tags) {
        if (msg.tags[tag] === true)
            msg.tags[tag] = null;
    }
    const timestamp = msg.tags['tmi-sent-ts']
        ? new Date(parseInt(msg.tags['tmi-sent-ts']))
        : new Date();
    let name = msg.tags['display-name'];
    // Edge case where display-name ends in a space
    if (name)
        name = name.trim();
    return {
        '@timestamp': timestamp.toISOString(),
        id: msg.tags['id'],
        raw: msg.raw,
        command: msg.command,
        message: msg.params[1],
        msg_id: msg.tags['msg-id'],
        user_id: msg.tags['user-id'],
        display_name: name,
        login: name ? name.toLowerCase() : undefined,
    };
}
exports.tmiMessage = tmiMessage;
function getIndex(channel) {
    return process.env.NODE_ENV === 'production'
        ? `tmi-${channel.slice(1)}`
        : `dev-tmi-${channel.slice(1)}`;
}
exports.getIndex = getIndex;
async function bulkIndexTmi(data) {
    const operations = data.map((x) => {
        const meta = { create: { _index: getIndex(x.channel) } };
        return JSON.stringify(meta) + '\n' + JSON.stringify(x.message);
    });
    return client.bulk({ operations });
}
exports.bulkIndexTmi = bulkIndexTmi;
