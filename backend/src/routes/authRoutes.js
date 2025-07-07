import express from 'express';
import { loginOrRegister, verifyLoginToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginOrRegister);
router.get('/verify/:token', verifyLoginToken);

export default router;