import express, { Request } from 'express';

import SessionController from './controllers/SessionController';
import authMiddleware from './middlewares/auth';

const routes = express.Router();

const sessionController = new SessionController();

routes.post('/sessions', sessionController.store);

// apos este .use todas as rotas usam autentic
routes.use(authMiddleware);

export default routes;
