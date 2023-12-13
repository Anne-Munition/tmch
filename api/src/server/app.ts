import path from 'path';
import express from 'express';
import morgan from 'morgan';
import passport from './passport';
import Api from './routes';
import sessionStore from './sessionStore';

const app = express();
if (process.env.NODE_ENV === 'production') app.use(morgan('short'));
else app.use(morgan('dev'));

app.use(sessionStore);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', Api);

if (process.env.NODE_ENV === 'production') {
  const wwwDir = path.join(__dirname, '../../../frontend/dist');

  app.get('/', (req, res, next) => {
    if (!req.isAuthenticated()) {
      res.redirect('/api/auth/login');
      return;
    }
    res.sendFile(path.join(wwwDir, 'index.html'));
  });

  app.use(express.static(wwwDir));

  app.all('*', (req, res, next) => {
    res.sendFile(path.join(wwwDir, 'index.html'));
  });
}

export default app;
