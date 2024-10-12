import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const registerValidationRules = () => {
  return [
    body('username').notEmpty().withMessage('Требуется имя пользователя'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Пароль должен быть длиной не менее 6 символов'),
    body('email').isEmail().withMessage('Неверный адрес электронной почты').normalizeEmail(),
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

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export { registerValidationRules, validate, loginValidationRules };
