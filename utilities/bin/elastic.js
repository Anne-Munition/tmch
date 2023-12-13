"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tmiMessage = void 0;
exports.default = (client, logger, esUrl) => {
    async function ping() {
        const { hostname, pathname } = new URL(esUrl);
        const response = await client.ping();
        if (!response)
            throw new Error(`Unable to connect to ElasticSearch server: '${hostname}${pathname}'`);
        logger.info(`Connected to ElasticSearch: '${hostname}'`);
    }
    return {
        ping,
    };
};
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
