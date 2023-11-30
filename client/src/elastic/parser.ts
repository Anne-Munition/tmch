function tmiMessage(msg: { [p: string]: any }): TmiMessage {
  for (const tag in msg.tags) {
    if (msg.tags[tag] === true) msg.tags[tag] = null;
  }

  const timestamp = msg.tags['tmi-sent-ts']
    ? new Date(parseInt(msg.tags['tmi-sent-ts']))
    : new Date();

  let name = msg.tags['display-name'];
  // Edge case where display-name ends in a space
  if (name) name = name.trim();

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

export default {
  tmiMessage,
};
