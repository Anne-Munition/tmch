import mongoose from 'mongoose';
import winston from 'winston';

const options: mongoose.ConnectOptions = {};

export default (logger: winston.Logger) => {
  async function connect(): Promise<void> {
    const url = getConnectionString();
    const { hostname, pathname } = new URL(url);
    await mongoose.connect(url, options);
    logger.info(`Connected to MongoDB: '${hostname}${pathname}'`);
  }

  async function disconnect(): Promise<void> {
    await mongoose.disconnect();
    logger.info('Database connection closed');
  }

  function getConnectionString(): string {
    if (!process.env.MONGO_URL) throw new Error('Missing MONGO_URL');
    return process.env.MONGO_URL;
  }

  function isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  return {
    connect,
    disconnect,
    getConnectionString,
    isConnected,
  };
};
