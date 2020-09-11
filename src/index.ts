import express from 'express';
import cors from 'cors';
import path from 'path';

import Routes from './routes';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(Routes);

app.listen(3333);
