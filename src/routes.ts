import express, { Request } from 'express';

import authMiddleware from './middlewares/auth';
import SessionController from './controllers/SessionController';
import RecipientController from './controllers/RecipientController';

const routes = express.Router();

const sessionController = new SessionController();
const recipientController = new RecipientController();

routes.post('/sessions', sessionController.store);

// apos este .use todas as rotas usam autentic
routes.use(authMiddleware);

// routes recipient
routes.post('/recipients', recipientController.create);
routes.put('/recipients/:id', recipientController.update);

export default routes;
