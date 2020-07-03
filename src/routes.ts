import express, { Request } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import authMiddleware from './middlewares/auth';
import SessionController from './controllers/SessionController';
import RecipientController from './controllers/RecipientController';
import CourierController from './controllers/CourierController';
import OrderController from './controllers/OrdersController';
import OrderUpdates from './controllers/OrdersUpdatesController';

const routes = express.Router();

const sessionController = new SessionController();
const recipientController = new RecipientController();
const courierController = new CourierController();
const ordersController = new OrderController();
const ordersUpdates = new OrderUpdates();

const upload = multer(multerConfig);

routes.post('/sessions', sessionController.store);

// apos este .use todas as rotas usam autenticação
routes.use(authMiddleware);

// routes recipient
routes.post('/recipients', recipientController.create);
routes.put('/recipients/:id', recipientController.update);

// routes couriers
routes.post('/couriers', upload.single('image'), courierController.create);
routes.get('/couriers', courierController.index);
routes.put('/couriers/:id', courierController.update);
routes.delete('/couriers/:id', courierController.delete);

// routes orders
routes.post('/orders', ordersController.create);
routes.get('/orders', ordersController.index);
routes.delete('/orders/:id', ordersController.delete);
routes.put('/orders/:id', ordersController.update);

// routes orders updates()
routes.get('/orders/date/start/:id', ordersUpdates.updateStartDate);
routes.get('/orders/date/end/:id', ordersUpdates.updateEndDate);
routes.get('/orders/cancel/:id', ordersUpdates.cancelUpdate);

export default routes;
