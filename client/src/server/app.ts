import express from 'express';
import morgan from 'morgan';
import StatusService from './services/status';

const app = express();
if (process.env.NODE_ENV === 'production') app.use(morgan('short'));
else app.use(morgan('dev'));

app.get('/status', (req, res, next) => {
  try {
    const response = StatusService();
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
});

export default app;
