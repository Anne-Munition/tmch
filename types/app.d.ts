interface App {
  start: () => Promise<void>;
  stop: () => Promise<void>;
}
