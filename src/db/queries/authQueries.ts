import { db } from '../db';
import jwt from 'jsonwebtoken';
import { CreateUserParams, GetUserParams } from '../../types/authTypes';

const getUserByUsernameOrEmailOrPhone = async ({ phone_number }: GetUserParams) => {
  try {
    const result = await db.query('SELECT * FROM Users WHERE phone_number=$1', [phone_number]);
    return result.rows;
  } catch (error: any) {
    throw new Error('Ошибка при получении пользователя:' + error.message);
  }
};

const createUser = async ({ password, phone_number, provider }: CreateUserParams) => {
  const newUser = await db.query(
    'INSERT INTO Users ( password_hash, phone_number, provider) VALUES ($1, $2, $3)',
    [password, phone_number, provider],
  );
  return newUser;
};

const verifyRefreshToken = async (token: string): Promise<any> => {
  try {
    const { JWT_SECRET } = process.env;
    const decoded: any = jwt.verify(token, `${JWT_SECRET}`);
    const query = `SELECT user_id FROM RefreshTokens WHERE user_id = $1 AND token = $2`;
    const result = await db.query(query, [decoded.userId, token]);
    if (result.rows.length > 0) {
      return { userId: decoded.userId };
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

const saveRefreshToken = async (userId: number, refreshToken: string): Promise<void> => {
  const query = `
INSERT INTO RefreshTokens (user_id, token, created_at)
VALUES ($1, $2, NOW())
ON CONFLICT (user_id) DO UPDATE SET token = $2, created_at = NOW();
`;
  await db.query(query, [userId, refreshToken]);
};
//функция для сохранения код в бд
const saveVerifycationCode = async (phone_number: number, code: string): Promise<void> => {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); //код действителен 5 минут
  const query = `INSERT INTO VerificationCodes (phone_number, verification_code, expires_at) VALUES ($1, $2, $3)`;
  await db.query(query, [phone_number, code, expiresAt]);
};

//функция для проверки кода в бд
const verifyCodeInDb = async (phone_number: string, code: string): Promise<boolean> => {
  const query = `SELECT * FROM VerificationCodes WHERE user_id = $1 AND verification_code = $2
  AND expires_at > NOW()`;
  const result = await db.query(query, [phone_number, code]);
  return result.rows.length > 0;
};
export {
  getUserByUsernameOrEmailOrPhone,
  createUser,
  verifyRefreshToken,
  saveRefreshToken,
  saveVerifycationCode,
  verifyCodeInDb,
};
