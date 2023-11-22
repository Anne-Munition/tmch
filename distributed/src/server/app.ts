import compression from 'compression';
import express from 'express';
import morgan from 'morgan';
import ChatService from './services/chat';
import StatusService from './services/status';

const app = express();
app.use(compression());
if (process.env.NODE_ENV === 'production') app.use(morgan('short'));
else app.use(morgan('dev'));

app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/status', (req, res, next) => {
  try {
    const response = StatusService();
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
});

app.get('/logs/:channel/:date', async (req, res, next) => {
  const { channel, date } = req.params;
  if (!channel || !date) {
    res.sendStatus(400);
    return;
  }
  try {
    const chatFileName = await ChatService.getChatFileName(channel, date);
    if (chatFileName === null) {
      res.sendStatus(404);
      return;
    }
    const data = await ChatService.getChatFileBuffer(chatFileName);
    res.status(200).type('text').send(data);
  } catch (e) {
    next(e);
  }
});

export default app;
