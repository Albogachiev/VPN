import { db } from '../db';
import jwt from 'jsonwebtoken';
import { CreateUserParams, GetUserParams } from '../../types/authTypes';

const getUserByUsernameOrEmailOrPhone = async ({
  password,
  email,
  phone_number,
}: GetUserParams) => {
  const result = await db.query(
    'SELECT * FROM Users WHERE password=$1 Or email=$2 Or phone_number=$3',
    [password, email, phone_number],
  );
  return result.rows;
};

const createUser = async ({
  username,
  password,
  phone_number,
  email,
  provider,
}: CreateUserParams) => {
  const newUser = await db.query(
    'INSERT INTO User(username, password_hash, phone_numbers, email, provider) VALUES ($1, $2, $3, $4, $5)',
    [username, password, phone_number, email, provider],
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

export { getUserByUsernameOrEmailOrPhone, createUser, verifyRefreshToken, saveRefreshToken };
