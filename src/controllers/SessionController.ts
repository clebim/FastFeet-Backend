import { Request, Response } from 'express';
import * as Yup from 'yup';
import jwt from 'jsonwebtoken';

import authConfig from '../../config/authConfig';
import knex from '../database/connection';
import checkPassword from '../utils/CheckPassword';

class SessionController {
  async store(req: Request, res: Response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const { email, password } = req.body;

    const user = await knex('users').where('email', email).select('*').first();

    if (!user) {
      return res.status(401).json({ error: 'user not found' });
    }

    if (!(await checkPassword(email, password))) {
      return res.status(401).json({ error: 'password does not match' });
    }

    const { id, name, admin } = user;

    return res.json({
      user: {
        id,
        name,
        admin,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default SessionController;
