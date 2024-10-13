import { Router } from 'express';
import { registerUser, loginUser, refreshAccessToken } from '../controllers';
import { registerValidationRules, validate, loginValidationRules } from '../middlewares';

const router = Router();

router
  .post('/register', registerValidationRules(), validate, registerUser)
  .post('/login', loginValidationRules(), validate, loginUser)
  .post('/refresh-token', refreshAccessToken);

export default router;
