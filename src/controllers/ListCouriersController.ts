import { Request, Response } from 'express';

import knex from '../database/connection';

interface Courier {
  name: string;
}

class ListCouriersController {
  async index(req: Request, res: Response) {
    const userId = <number>req.userId;

    const user = await knex('users')
      .where('id', userId)
      .select('admin')
      .first();

    if (!user) {
      return res.status(400).json({ error: 'user does not admin' });
    }

    const couriers: Courier[] = await knex('couriers').select('name');

    const auxiliarList: string[] = [];

    // eslint-disable-next-line array-callback-return
    couriers.map((item) => {
      auxiliarList.push(item.name);
    });

    return res.status(200).json({ couriers: auxiliarList });
  }
}

export default new ListCouriersController();
