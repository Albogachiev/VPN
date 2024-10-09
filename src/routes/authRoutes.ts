import { Router } from 'express';
import { registerUser } from '../controllers';
import { registerValidationRules, validate } from '../middlewares';

const router = Router();

router.post('/register', [registerValidationRules(), validate], registerUser);

export default router;
