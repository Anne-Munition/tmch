import { LiveChat } from 'youtube-chat';

console.log('here');
const liveChat = new LiveChat({ channelId: 'UCQj4ZJd2QxRHwVYQbMvcKdQ' });

// Emit at start of observation chat.
// liveId: string
liveChat.on('start', (liveId) => {
  console.log('yt start', liveId);
  /* Your code here! */
});

// Emit at end of observation chat.
// reason: string?
liveChat.on('end', (reason) => {
  console.log('yt end', reason);
  /* Your code here! */
});

// Emit at receive chat.
// chat: ChatItem
liveChat.on('chat', (chatItem) => {
  console.log('yt chat', chatItem);
  /* Your code here! */
});

// Emit when an error occurs
// err: Error or any
liveChat.on('error', (err) => {
  console.log('yt error', err);
  /* Your code here! */
});

export function start() {
  liveChat.start();
}
