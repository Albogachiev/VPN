import { Pool } from 'pg';

const pool = new Pool({
  user: 'maga1',
  host: 'localhost',
  database: 'vpn_db',
  password: '123',
  port: 5432,
});

export const db = pool;
