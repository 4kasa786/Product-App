import express from 'express';
import { signin, signup } from '../controllers/auth.controller.js';
import { validate } from '../utils/validate.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';
const router = express.Router();

router.post('/signup', validate(registerSchema), signup);
router.post('/signin', validate(loginSchema), signin);


export default router;

