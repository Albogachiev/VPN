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
  username: string;
  password: string;
  phone_number: string;
  email: string;
  provider: string;
}

interface GetUserParams {
  password?: string;
  email: string;
  phone_number?: string;
}

export { User, CreateUserParams, GetUserParams };
