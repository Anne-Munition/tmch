import { NextFunction, Request, Response } from 'express';

export default (req: Request, res: Response, next: NextFunction): void => {
  // Bypass auth with Postman requests in development
  if (
    process.env.NODE_ENV === 'development' &&
    req.headers['user-agent']?.startsWith('PostmanRuntime')
  ) {
    return next();
  }
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    next();
  }
};
