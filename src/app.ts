import express, { Request, Response } from 'express';
const app = express();

require('dotenv').config();
const morgan = require('morgan');
app.use(morgan('dev'));

import routerReg from './routes/registrationRout';

const { PORT } = process.env;

app.use('/', routerReg);

app.listen(PORT, () => console.log(`Сервер крутится на ${PORT} порту!`));
