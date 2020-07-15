import { Request, Response } from 'express';

// import { id } from 'date-fns/locale';
import knex from '../database/connection';

class OrderList {
  async listOrders(req: Request, res: Response) {
    const deliverymanId = req.params.id;

    const deliverymanExists = await knex('couriers')
      .where('id', deliverymanId)
      .select('*')
      .first();

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman does not exist' });
    }

    const orders = await knex('orders')
      .where({
        deliveryman_id: deliverymanId,
        end_date: null,
        canceled_at: null,
      })
      .select('*');

    return res.json(orders);
  }

  async ListCompletedOrders(req: Request, res: Response) {
    const deliverymanId = req.params.id;

    const deliverymanExists = await knex('couriers')
      .where('id', deliverymanId)
      .select('*')
      .first();

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman does not exist' });
    }

    const orders = await knex('orders')
      .where('deliveryman_id', deliverymanId)
      .whereNotNull('end_date')
      .whereNull('canceled_at')
      .select('*');

    return res.json(orders);
  }
}

export default OrderList;
