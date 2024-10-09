import { Request, Response } from 'express';
import { getUserByUsernameOrEmailOrPhone, createUser } from '../db/queries';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const registerUser = async (req: Request, res: Response) => {
  const { username, password, phone_number, email } = req.body;
  const existingUser = await getUserByUsernameOrEmailOrPhone({ password, phone_number, email });
  if (existingUser.length > 0) {
    return res.status(400).json({
      errors: 'Пользователь с таким адресом электронной почты или номером телефона уже существует',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser({ username, password: hashedPassword, phone_number, email });
  const { JWT_SECRET } = process.env;

  const token = jwt.sign({ userId: newUser.rows[0].user_id }, `${JWT_SECRET}`, {
    expiresIn: '1h',
  });
  res.status(201).json({ message: 'Пользователь успешно зарегистрировался', token });
};

export { registerUser };
