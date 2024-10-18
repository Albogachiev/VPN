import express from 'express';
const app = express();
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import session from 'express-session';

require('dotenv').config();
const morgan = require('morgan');
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { PORT, SESSION_SECRET } = process.env;

app.use(
  session({
    secret: SESSION_SECRET || '123',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 5 * 60 * 1000, // Время жизни 5 минут
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'lax',
    },
  }),
);
app.use('/', authRoutes);
app.use('/', userRoutes);

app.listen(PORT, () => console.log(`Сервер крутится на ${PORT} порту!`));
