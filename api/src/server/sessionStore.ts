import MongoStore from 'connect-mongo';
import session from 'express-session';
import { Duration } from 'luxon';
import * as database from '../database';
import logger from '../logger';

const sessionLength = Duration.fromObject({ day: 7 }).valueOf();
logger.debug(`Session cookie set to ${sessionLength}`);

export default session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: 'auto',
    httpOnly: true,
    maxAge: sessionLength,
  },
  store: MongoStore.create({
    mongoUrl: database.getConnectionString(),
  }),
});
