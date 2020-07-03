import { Request, Response } from 'express';
import * as Yup from 'yup';

import knex from '../database/connection';

interface UserAdmin {
  admin: number;
}

class RecipientController {
  async create(req: Request, res: Response) {
    const userId = <number>req.userId;

    const user = <UserAdmin>(
      await knex('users').where('id', userId).select('admin').first()
    );

    if (user.admin === 0) {
      return res.status(401).json({ error: 'user does not admin' });
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'validation fails' });
    }

    const recipient = await knex('recipients').insert(req.body);

    return res.json({ id: recipient[0] });
  }

  async update(req: Request, res: Response) {
    const userId = <number>req.userId;

    const user = <UserAdmin>(
      await knex('users').where('id', userId).select('admin').first()
    );

    if (user.admin === 0) {
      return res.status(401).json({ error: 'user does not admin' });
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'validation fails' });
    }

    const recipientId = req.params.id;

    const {
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = req.body;

    const updateRecipient = await knex('recipients')
      .where('id', Number(recipientId))
      .update({
        name,
        street,
        number,
        complement,
        state,
        city,
        zip_code,
      });

    return res.json(updateRecipient);
  }
}

export default RecipientController;
