import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const registerValidationRules = () => {
  return [
    body('password')
      .isLength({ min: 6 })
      .withMessage('Пароль должен быть длиной не менее 6 символов'),
    body('phone')
      .optional()
      .isLength({ min: 9 })
      .withMessage('Номер телефона должен состоять, не менее чем из 9 цифр'),
  ];
};

const loginValidationRules = () => {
  return [
    body('password')
      .isLength({ min: 6 })
      .withMessage('Пароль должен быть длиной не менее 6 символов'),
    body('email').isEmail().withMessage('Неверный адрес электронной почты').normalizeEmail(),
  ];
};

const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export { registerValidationRules, validate, loginValidationRules };
