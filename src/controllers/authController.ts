import { Request, Response } from 'express';
import { getUserByPhone, createUser, verifyRefreshToken, saveRefreshToken } from '../db/queries';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import twilio from 'twilio';
import crypto from 'crypto';

const sendVerificationCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { password, phone_number, provider } = req.body;
    req.session.phone_number = phone_number;
    req.session.password = password; //сохраняем на 5 мин
    req.session.provider = provider;
    await req.session.save();
    const twilioClient = twilio('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');
    const code = crypto.randomInt(100000, 999999).toString(); //генерация 6 значного кода
    await twilioClient.messages.create({
      //отправка кода на телефон
      body: `Ваш код для подтверждения: ${code}`,
      from: 'TWILIO_PHONE_NUMBER', //мой номер твилио
      to: phone_number,
    });
    res.status(200).json({ message: 'Код подтверждения отправлен.' });
  } catch {
    res.status(500).json({ message: 'Ошибка при отправке кода подтверждения.' });
  }
};

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { password, phone_number, provider } = req.session;
    const existingUser = await getUserByPhone({ password, phone_number });
    if (existingUser.length > 0) {
      res.status(400).json({
        errors:
          'Пользователь с таким адресом электронной почты или номером телефона уже существует',
      });
      return;
    }
    if (!password || !phone_number) {
      res.status(400).json({ message: 'Все поля обязательны.' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({
      password: hashedPassword,
      phone_number,
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
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при регистрации пользователя.' });
  }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { phone_number, password } = req.body;
  const user = await getUserByPhone({ phone_number });
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

export { registerUser, loginUser, refreshAccessToken, sendVerificationCode };
