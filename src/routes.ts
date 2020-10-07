import express from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import authMiddleware from './middlewares/auth';
import SessionController from './controllers/SessionController';
import RecipientController from './controllers/RecipientController';
import CourierController from './controllers/CourierController';
import OrderController from './controllers/OrderController';
import DeliveryProblems from './controllers/Delivery_ProblemsController';
import ListCouriersController from './controllers/ListCouriersController';
import ListRecipientsController from './controllers/ListRecipientsController';
import OrderUpdates from './utils/OrderUpdates';
import OrderList from './utils/OrderList';

const routes = express.Router();

const sessionController = new SessionController();
const recipientController = new RecipientController();
const courierController = new CourierController();
const orderController = new OrderController();
const deliveryProblems = new DeliveryProblems();
const orderUpdates = new OrderUpdates();
const orderList = new OrderList();

const upload = multer(multerConfig);

routes.post('/sessions', sessionController.store);

// apos este .use todas as rotas usam autenticação
routes.use(authMiddleware);

// routes recipient
routes.post('/recipients', recipientController.create);
routes.get('/recipients', recipientController.index);
routes.put('/recipients/:id', recipientController.update);

// routes couriers
routes.post('/couriers', upload.single('image'), courierController.create);
routes.get('/couriers', courierController.index);
routes.put('/couriers/:id', courierController.update);
routes.delete('/couriers/:id', courierController.delete);

// routes orders
routes.post('/orders', orderController.create);
routes.get('/orders', orderController.index);
routes.delete('/orders/:id', orderController.delete);
routes.put('/orders/:id', orderController.update);

// routes orders updates()
routes.get(
  '/orders/date/start/:orderid/deliveryman/:id',
  orderUpdates.updateStartDate
);
routes.get(
  '/orders/date/end/:orderid/deliveryman/:id',
  orderUpdates.updateEndDate
);
routes.get('/orders/cancel/:id', orderUpdates.cancelUpdate);

// routes orders list unique Id
routes.get('/orders/deliveryman/:id/deliveries', orderList.listOrders);
routes.get('/orders/deliveryman/:id/completeds', orderList.ListCompletedOrders);

// routes delivery problems
routes.post('/delivery/:id/problems', deliveryProblems.create);
routes.get('/delivery/problems', deliveryProblems.index);
routes.get('/delivery/:id/problems', deliveryProblems.store);
routes.delete('/delivery/:id/cancel_problem', deliveryProblems.delete);

// route list couriers
routes.get('/couriers/list', ListCouriersController.index);

// route list Recipients
routes.get('/recipients/list', ListRecipientsController.index);

export default routes;
