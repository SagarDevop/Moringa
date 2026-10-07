import express from 'express';
import { login, forgotPassword, verifyOtp, resetPassword } from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', login);
router.post('/admin/forgot-password', forgotPassword);
router.post('/admin/verify-otp', verifyOtp);
router.post('/admin/reset-password', resetPassword);

export default router;
