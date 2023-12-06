declare module 'pushover-notifications' {
  export = PushoverNotifications;
}

declare class PushoverNotifications {
  constructor(config: PushoverConstructorConfig);
  send(message: PushoverMessageObject): void;
}

interface PushoverMessageObject {
  message: string;
  sound: string;
}

interface PushoverConstructorConfig {
  user: string;
  token: string;
}
