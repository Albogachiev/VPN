import { db } from '../db';
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

const createUser = async ({ username, password, phone_number, email }: CreateUserParams) => {
  const newUser = await db.query(
    'INSERT INTO User(username, password_hash, phone_numbers, email) VALUES ($1, $2, $3, $4)',
    [username, password, phone_number, email],
  );
  return newUser;
};

export { getUserByUsernameOrEmailOrPhone, createUser };
