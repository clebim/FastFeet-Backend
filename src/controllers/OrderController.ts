import { Request, Response } from 'express';
import * as Yup from 'yup';

import knex from '../database/connection';
import Mail from '../lib/Mail';

class OrderController {
  async create(req: Request, res: Response) {
    const userId = <number>req.userId;

    const user = await knex('users')
      .where('id', userId)
      .select('admin')
      .first();

    if (!user) {
      return res.status(400).json({ error: 'user does not admin' });
    }

    const schema = Yup.object().shape({
      recipient: Yup.string().required(),
      deliveryman: Yup.string().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { recipient, deliveryman, product } = req.body;

    const recipientExists = await knex('recipients')
      .where('name', recipient)
      .select('id');

    if (recipientExists.length === 0) {
      return res.status(400).json({ error: 'Recipient not exists' });
    }

    const deliverymanExists = await knex('couriers')
      .where('name', deliveryman)
      .select('id', 'email');

    if (deliverymanExists.length === 0) {
      return res.status(400).json({ error: 'deliveryman not exists' });
    }

    const order = await knex('orders').insert({
      recipient_id: recipientExists[0].id,
      deliveryman_id: deliverymanExists[0].id,
      product,
    });

    await Mail.sendMail({
      to: `${deliveryman} <${deliverymanExists[0].email}>`,
      sucject: 'new order',
      text: 'new order already',
    });

    return res.json(order);
  }

  async index(req: Request, res: Response): Promise<Response> {
    const userId = <number>req.userId;

    const user = await knex('users')
      .where('id', userId)
      .select('admin')
      .first();

    if (!user) {
      return res.status(400).json({ error: 'user does not admin' });
    }

    const orders = await knex('orders')
      .join('couriers', 'orders.deliveryman_id', '=', 'couriers.id')
      .join('recipients', 'orders.recipient_id', '=', 'recipients.id')
      .select({
        name_courier: 'couriers.name',
        name_recipient: 'recipients.name',
        id: 'orders.id',
        canceled_at: 'orders.canceled_at',
        start_date: 'orders.start_date',
        end_date: 'orders.end_date',
        city: 'recipients.city',
        state: 'recipients.state',
      });

    return res.json(orders);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const userId = <number>req.userId;

    const user = await knex('users')
      .where('id', userId)
      .select('admin')
      .first();

    if (!user) {
      return res.status(400).json({ error: 'user does not admin' });
    }

    const schema = Yup.object().shape({
      recipient: Yup.string().required(),
      deliveryman: Yup.string().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const orderId = req.params.id;

    const orderExists = await knex('orders')
      .where('id', orderId)
      .select('*')
      .first();

    if (!orderExists) {
      return res.status(400).json({ error: 'Order not exists' });
    }

    const { recipient, deliveryman, product } = req.body;

    const recipientExists = await knex('recipients')
      .where({
        name: recipient,
      })
      .select('id');

    if (recipientExists.length === 0) {
      return res.status(400).json({ error: 'Recipient not exists' });
    }

    const deliverymanExists = await knex('couriers')
      .where('name', deliveryman)
      .select('id');

    if (deliverymanExists.length === 0) {
      return res.status(400).json({ error: 'deliveryman not exists' });
    }

    const orderUpdated = await knex('orders').where('id', orderId).update({
      recipient_id: recipientExists[0].id,
      deliveryman_id: deliverymanExists[0].id,
      product,
    });

    return res.json(orderUpdated);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const userId = <number>req.userId;

    const user = await knex('users')
      .where('id', userId)
      .select('admin')
      .first();

    if (!user) {
      return res.status(400).json({ error: 'user does not admin' });
    }

    const idOrder = req.params.id;

    const orderExists = await knex('orders')
      .where('id', idOrder)
      .select('*')
      .first();

    if (!orderExists) {
      return res.send(400).json({ error: 'order not exists' });
    }

    await knex('orders').where('id', idOrder).delete();

    return res.json({ ok: 'Order deleted' });
  }
}

export default OrderController;
