import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import { sendLoginEmail } from '../services/emailService.js';

// @desc    Register a new user (or find existing one) and send login link
// @route   POST /api/auth/login
// @access  Public
const loginOrRegister = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[a-zA-Z0-9._%+-]+@etu\.edu\.tr$/.test(email)) {
    res.status(400);
    throw new Error('Lütfen geçerli bir @etu.edu.tr e-posta adresi girin.');
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ email });
  }

  // Create a short-lived token for the login link
  const loginToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LOGIN_EXPIRES_IN || '15m',
  });

  // This URL will be sent to the user's email
  const loginUrl = `${req.protocol}://${req.get('host')}/api/auth/verify/${loginToken}`;

  // Send the email (placeholder for now)
  try {
    await sendLoginEmail(user.email, loginUrl);
    res.status(200).json({
      message: `Giriş linki ${user.email} adresine gönderildi. Lütfen e-postanızı kontrol edin.`,
    });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500);
    throw new Error('E-posta gönderilirken bir hata oluştu.');
  }
});

// @desc    Verify login token and issue a session token
// @route   GET /api/auth/verify/:token
// @access  Public
const verifyLoginToken = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    res.status(400);
    throw new Error('Geçersiz doğrulama linki.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(404);
      throw new Error('Kullanıcı bulunamadı.');
    }

    // Mark user as verified if they weren't already
    user.isVerified = true;
    await user.save();

    // Issue a longer-lived session token
    const sessionToken = generateToken(user._id);

    res.status(200).json({
      message: 'Giriş başarılı!',
      token: sessionToken,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(401);
    throw new Error('Geçersiz veya süresi dolmuş link. Lütfen tekrar giriş yapmayı deneyin.');
  }
});

export { loginOrRegister, verifyLoginToken };