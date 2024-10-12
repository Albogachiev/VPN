import jwt from 'jsonwebtoken';
import { Response, Request } from 'express';
// import dotenv from 'dotenv';
// dotenv.config();

const authMiddleware = (req: Request, res: Response, next: Function) => {
  const token = req.header('Authorization')?.replace('Bearer', '');

  if (!token) {
    return res.status(401).json({ errors: 'Нет доступа' });
  }
  try {
    const { JWT_SECRET } = process.env;
    const decoded = jwt.verify(token, `${JWT_SECRET}`);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ errors: 'Неверный токен' });
  }
};

export { authMiddleware };
