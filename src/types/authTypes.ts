import { JwtPayload } from 'jsonwebtoken';
import 'express-session';

declare module 'express-session' {
  interface SessionData extends CreateUserParams
}

declare global {
  //добавил свойство user в объекте Request
  namespace Express {
    interface Request {
      user: string | JwtPayload;
    }
  }
}
interface User {
  user_id: number;
  username: string;
  password_hash?: string;
  phone_number?: string;
  google_id?: string;
  apple_id?: string;
  email: string;
  provider?: string;
  created_at: Date;
}

interface CreateUserParams {
  password: string;
  phone_number: string;
  provider?: string;
}

interface GetUserParams {
  password?: string;
  phone_number?: string;
}

export { User, CreateUserParams, GetUserParams };
