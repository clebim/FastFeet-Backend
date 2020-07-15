import { Request, Response } from 'express';
import * as Yup from 'yup';

import knex from '../database/connection';

interface Delivery_Problem {
  delivery_id: number;
  description: string;
}

class Delivery_problems {
  async create(req: Request, res: Response) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const delivery_id = req.params.id;
    const { description } = req.body;

    const deliveryExists = await knex('orders')
      .where('id', delivery_id)
      .select('*')
      .first();

    if (!deliveryExists) {
      return res.status(400).json({ error: 'delivery does not exists' });
    }

    const createProblem = await knex('delivery_problems').insert({
      delivery_id,
      description,
    });

    return res.json(createProblem);
  }

  async index(req: Request, res: Response) {
    const { userId } = req;

    const userAdmin = await knex('users')
      .where('id', userId)
      .select('admin')
      .first();

    if (userAdmin.admin === 0) {
      return res.status(400).json({ error: 'user does not admin' });
    }

    const allProblems = await knex
      .select('delivery_id', 'description')
      .from<Delivery_Problem>('delivery_problems');

    return res.status(200).json(allProblems);
  }

  async store(req: Request, res: Response) {
    const delivery_id = req.params.id;

    const deliveryExists = await knex('orders')
      .where('id', delivery_id)
      .select('*')
      .first();

    if (!deliveryExists) {
      return res.status(400).json({ error: 'delivery does not exists' });
    }

    const problems = await knex
      .where('delivery_id', delivery_id)
      .select('delivery_id', 'description')
      .from<Delivery_Problem>('delivery_problems');

    return res.status(200).json(problems);
  }

  async delete(req: Request, res: Response) {
    const delivery_id = req.params.id;

    const deliveryExists = await knex('orders')
      .where('id', delivery_id)
      .select('*')
      .first();

    if (!deliveryExists) {
      return res.status(400).json({ error: 'delivery does not exists' });
    }

    const date = new Date();

    await knex('orders').where('id', delivery_id).update({
      canceled_at: date,
    });

    return res.status(200).json({ ok: 'deleted ' });
  }
}

export default Delivery_problems;
