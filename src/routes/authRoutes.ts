import { Router } from 'express';
import { registerUser, loginUser, refreshAccessToken, sendVerificationCode } from '../controllers';
import { registerValidationRules, validate, loginValidationRules } from '../middlewares';

const router = Router();

router
  .post('/register', registerUser)
  .post('/login', loginValidationRules(), validate, loginUser)
  .post('/refresh-token', refreshAccessToken)
  .post('/send-code-twilio', registerValidationRules(), validate, sendVerificationCode);
export default router;
