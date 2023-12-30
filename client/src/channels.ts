export const twitchChannels: string[] = (process.env.TWITCH_CHANNELS || '')
  .split(',')
  .filter((x) => x)
  .map((channel) => {
    return channel.toLowerCase().trim().replace('#', '');
  })
  .sort((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  })
  .map((x) => `#${x}`);
