import { Request, Response } from 'express';
import * as Yup from 'yup';

import { KnexTimeoutError } from 'knex';
import knex from '../database/connection';

interface ReqId extends Request {
  userId?: number;
}

interface UserAdmin {
  admin: number;
}

class CourierController {
  async create(req: ReqId, res: Response) {
    const userId = <number>req.userId;

    const user = <UserAdmin>(
      await knex('users').where('id', userId).select('admin').first()
    );

    if (user.admin === 0) {
      return res.status(401).json({ error: 'user does not admin' });
    }
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const { name, email } = req.body;

    const courierExists = await knex('couriers')
      .where('email', email)
      .select('*')
      .first();

    if (courierExists) {
      return res.status(401).json({ error: 'courier already exists' });
    }

    const avatar = req.file.filename;

    const courier = await knex('couriers').insert({
      name,
      email,
      avatar,
    });

    const [id] = courier;

    return res.json({ id, name, email, avatar: req.file.filename });
  }

  async index(req: Request, res: Response) {
    const couriers = await knex('couriers').select('*');

    const serializedCouriers = couriers.map((courier) => {
      return {
        id: courier.id,
        name: courier.name,
        email: courier.email,
        avatar: courier.avatar,
      };
    });

    return res.json(serializedCouriers);
  }

  async update(req: ReqId, res: Response) {
    const courierId = req.params.id;

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const courierExists = await knex('couriers')
      .where('id', courierId)
      .select('*')
      .first();

    if (!courierExists) {
      return res.status(400).json({ error: 'Courier not exitst' });
    }

    const { name, email } = req.body;

    if (name && email) {
      const courierUpdated = await knex('couriers')
        .where('id', courierId)
        .update({
          name,
          email,
        });
    }

    if (name && !email) {
      const courierUpdated = await knex('couriers')
        .where('id', courierId)
        .update({
          name,
        });
    }

    if (email && !name) {
      const courierUpdated = await knex('couriers')
        .where('id', courierId)
        .update({
          email,
        });
    }

    const courierUpdated = await knex('couriers')
      .where('id', courierId)
      .select('*')
      .first();

    return res.json(courierUpdated);
  }

  async delete(req: Request, res: Response) {
    const courierId = req.params.id;

    const courierExists = await knex('couriers')
      .where('id', courierId)
      .select('*')
      .first();

    if (!courierExists) {
      return res.status(400).json({ error: 'Courier not exitst' });
    }

    await knex('couriers').where('id', courierId).delete();

    return res.json({ ok: 'Courier deleted' });
  }
}

export default CourierController;
