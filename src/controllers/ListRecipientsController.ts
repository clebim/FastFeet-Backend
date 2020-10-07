import { Request, Response } from 'express';

import knex from '../database/connection';

interface Recipient {
  name: string;
}

class ListRecipientsController {
  async index(req: Request, res: Response) {
    const userId = <number>req.userId;

    const user = await knex('users')
      .where('id', userId)
      .select('admin')
      .first();

    if (!user) {
      return res.status(400).json({ error: 'user does not admin' });
    }

    const recipients: Recipient[] = await knex('recipients').select('name');

    const auxiliarList: string[] = [];

    // eslint-disable-next-line array-callback-return
    recipients.map((item) => {
      auxiliarList.push(item.name);
    });

    return res.status(200).json({ recipients: auxiliarList });
  }
}

export default new ListRecipientsController();
