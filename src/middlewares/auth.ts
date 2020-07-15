import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { Request, Response, NextFunction } from 'express';

import authConfig from '../config/authConfig';

export default async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = <string>req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = <any>await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'token invalid' });
  }
};
