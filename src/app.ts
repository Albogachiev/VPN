import express, { Request, Response } from 'express';
const app = express();

require('dotenv').config();
const morgan = require('morgan');
app.use(morgan('dev'));

const { PORT } = process.env;

app.listen(PORT, () => console.log(`Сервер крутится на ${PORT} порту!`));
