import { Router } from 'express';
import { registerUser, loginUser } from '../controllers';
import { registerValidationRules, validate, loginValidationRules } from '../middlewares';

const router = Router();

router.post('/register', registerValidationRules(), validate, registerUser);
router.post('/login', loginValidationRules(), validate, loginUser);

export default router;
