import express, { Request } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import authMiddleware from './middlewares/auth';
import SessionController from './controllers/SessionController';
import RecipientController from './controllers/RecipientController';
import CourierController from './controllers/CourierController';

const routes = express.Router();

const sessionController = new SessionController();
const recipientController = new RecipientController();
const courierController = new CourierController();

const upload = multer(multerConfig);

routes.post('/sessions', sessionController.store);

// apos este .use todas as rotas usam autentic
routes.use(authMiddleware);

// routes recipient
routes.post('/recipients', recipientController.create);
routes.put('/recipients/:id', recipientController.update);

// routes couriers
routes.post('/couriers', upload.single('image'), courierController.create);
routes.get('/couriers', courierController.index);
routes.put('/couriers/:id', courierController.update);
routes.delete('/couriers/:id', courierController.delete);

export default routes;
