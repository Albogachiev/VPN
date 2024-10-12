import express from 'express';
const app = express();

require('dotenv').config();
const morgan = require('morgan');
app.use(morgan('dev'));
app.use(express.json());

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

const { PORT } = process.env;

app.use('/', authRoutes);
app.use('/', userRoutes);

app.listen(PORT, () => console.log(`Сервер крутится на ${PORT} порту!`));
