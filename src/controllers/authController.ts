import { Request, Response } from 'express';
import {
  getUserByUsernameOrEmailOrPhone,
  createUser,
  verifyRefreshToken,
  saveRefreshToken,
} from '../db/queries';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password, phone_number, email, provider } = req.body;
  const existingUser = await getUserByUsernameOrEmailOrPhone({ password, phone_number, email });
  if (existingUser.length > 0) {
    res.status(400).json({
      errors: 'Пользователь с таким адресом электронной почты или номером телефона уже существует',
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser({
    username,
    password: hashedPassword,
    phone_number,
    email,
    provider,
  });
  const { JWT_SECRET } = process.env;

  const accessToken = jwt.sign({ userId: newUser.rows[0].user_id }, `${JWT_SECRET}`, {
    expiresIn: '30m',
  });
  const refreshToken = jwt.sign({ userId: newUser.rows[0].user_id }, `${JWT_SECRET}`, {
    expiresIn: '7d',
  });
  await saveRefreshToken(newUser.rows[0].user_id, refreshToken);
  res
    .status(201)
    .json({ message: 'Пользователь успешно зарегистрировался', accessToken, refreshToken });
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user = await getUserByUsernameOrEmailOrPhone({ email });
  if (user.length === 0) {
    res.status(400).json({ errors: 'Неверные учетные данные' });
    return;
  }
  const isMatch = await bcrypt.compare(password, user[0].password_hash);
  if (!isMatch) {
    res.status(400).json({ errors: 'Неверные учетные данные' });
    return;
  }

  const { JWT_SECRET } = process.env;
  const accessToken = jwt.sign({ userId: user[0].user_id }, `${JWT_SECRET}`, { expiresIn: '30m' });
  const refreshToken = jwt.sign({ userId: user[0].iser_id }, `${JWT_SECRET}`, { expiresIn: '7d' });
  await saveRefreshToken(user[0].user_id, refreshToken);

  res.status(200).json({ message: 'Успешный вход', accessToken, refreshToken });
};

const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;
  const user = await verifyRefreshToken(refreshToken);

  if (!user) {
    res.status(403).json({ message: 'Недействительный refresh токен' });
  }
  const { JWT_SECRET } = process.env;
  const accessToken = jwt.sign({ userId: user.user_id }, `${JWT_SECRET}`, { expiresIn: '30m' });
  res.status(200).json({ accessToken });
};

export { registerUser, loginUser, refreshAccessToken };
