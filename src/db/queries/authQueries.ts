import { db } from '../db';
import jwt from 'jsonwebtoken';
import { CreateUserParams, GetUserParams } from '../../types/authTypes';

const getUserByPhone = async ({ phone_number }: GetUserParams) => {
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

//функция для проверки кода в бд
const verifyCodeInDb = async (phone_number: string, code: string): Promise<boolean> => {
  const query = `SELECT * FROM VerificationCodes WHERE user_id = $1 AND verification_code = $2
  AND expires_at > NOW()`;
  const result = await db.query(query, [phone_number, code]);
  return result.rows.length > 0;
};
export { getUserByPhone, createUser, verifyRefreshToken, saveRefreshToken, verifyCodeInDb };
