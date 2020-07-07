import { Request, Response } from 'express';
import { getHours, parseISO, isSameDay } from 'date-fns';
import knex from '../database/connection';

interface DateOrder {
  start_date: number | Date;
}

class OrderUpdadates {
  async updateStartDate(req: Request, res: Response) {
    const deliverymanId = req.params.id;

    const deliverymanExists = await knex('couriers')
      .where('id', deliverymanId)
      .select('*')
      .first();

    if (!deliverymanExists) {
      return res.status(401).json({ error: 'Deliveryman does not exists' });
    }

    const orderId = req.params.orderid;

    const orderExist = await knex('orders')
      .where('id', orderId)
      .select('start_date')
      .first();

    if (!orderExist) {
      return res.status(400).json({ error: 'order does not exist' });
    }

    const startExists = await knex('orders')
      .where('id', orderId)
      .select('start_date');

    if (!(startExists[0].start_date === null)) {
      return res.status(400).json({ error: 'startDate already exist' });
    }

    const startDate = new Date();

    const ordersAvailable = await knex('orders')
      .where('deliveryman_id', deliverymanId)
      .whereNull('canceled_at')
      .whereNotNull('start_date')
      .whereNull('end_date')
      .select('start_date', 'id');

    const ordersCount = ordersAvailable.map((order) => {
      if (isSameDay(order.start_date, startDate)) {
        return { ...order, today: true };
      }

      return { ...order, today: false };
    });

    let count = 0;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < ordersCount.length; i++) {
      if (ordersCount[i].today === true) {
        count += 1;
      }
    }

    if (count > 5) {
      return res.status(400).json({ error: 'limit reached' });
    }

    const getHour = getHours(startDate);

    if (!(getHour > 7 && getHour < 18)) {
      return res.status(400).json({ error: 'out-of-hours request' });
    }

    await knex('orders').where('id', orderId).update({
      start_date: startDate,
    });

    return res.status(200).json({ ok: 'updated ' });
  }

  async updateEndDate(req: Request, res: Response) {
    const userId = <number>req.userId;

    const user = await knex('users')
      .where('id', userId)
      .select('admin')
      .first();

    if (user.admin === 0) {
      return res.status(401).json({ error: 'user does not admin' });
    }

    const orderId = req.params.id;

    const orderExist = await knex('orders')
      .where('id', orderId)
      .select('start_date')
      .first();

    if (!orderExist) {
      return res.status(400).json({ error: 'order does not exist' });
    }

    const endExists = await knex('orders')
      .where('id', orderId)
      .select('end_date');

    if (!(endExists[0].end_date === null)) {
      return res.status(400).json({ error: 'endDate already exist' });
    }

    const endDate = new Date();

    await knex('orders').where('id', orderId).update({
      end_date: endDate,
    });

    return res.status(200).json({ ok: 'confirmed endDate' });
  }

  async cancelUpdate(req: Request, res: Response) {
    const userId = <number>req.userId;

    const user = await knex('users')
      .where('id', userId)
      .select('admin')
      .first();

    if (user.admin === 0) {
      return res.status(401).json({ error: 'user does not admin' });
    }

    const orderId = req.params.id;

    const orderExist = await knex('orders')
      .where('id', orderId)
      .select('start_date')
      .first();

    if (!orderExist) {
      return res.status(400).json({ error: 'order does not exist' });
    }

    const cancelExists = await knex('orders')
      .where('id', orderId)
      .select('canceled_at');

    if (!(cancelExists[0].canceled_at === null)) {
      return res.status(400).json({ error: 'cancellation date already exist' });
    }

    const canceledAt = new Date();

    await knex('orders').where('id', orderId).update({
      canceled_at: canceledAt,
    });

    return res.status(200).json({ ok: 'cancellation date confirmed' });
  }
}

export default OrderUpdadates;
