import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { sendLoginEmail } from '../services/emailService.js';

// @desc    Login or register a user and send login link
// @route   POST /api/auth/login
// @access  Public
const loginOrRegister = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[a-zA-Z0-9._%+-]+@etu\.edu\.tr$/.test(email)) {
    res.status(400);
    throw new Error('Lütfen geçerli bir @etu.edu.tr e-posta adresi girin.');
  }

  // Kullanıcıyı bul veya oluştur
  let user = await User.findOneAndUpdate({ email }, {}, { upsert: true, new: true, setDefaultsOnInsert: true });

  // Kısa ömürlü giriş token'ı oluştur
  const loginToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LOGIN_EXPIRES_IN,
  });

  // Frontend'e yönlendirilecek URL
  const loginUrl = `${process.env.FRONTEND_URL}/auth/verify/${loginToken}`;

  // E-postayı gönder (simülasyon)
  await sendLoginEmail(user.email, loginUrl);

  res.status(200).json({
    message: `Giriş linki ${user.email} adresine gönderildi. Lütfen e-postanızı kontrol edin.`,
  });
});

// @desc    Verify login token and issue a session token
// @route   GET /api/auth/verify/:token
// @access  Public
const verifyLoginToken = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    res.status(400).send('Doğrulama token\'ı bulunamadı.');
  }

  // Gelen login token'ını doğrula
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    res.status(401);
    throw new Error('Kullanıcı bulunamadı.');
  }

  // Kullanıcının doğrulama durumunu güncelle
  user.isVerified = true;
  await user.save();

  // Uzun ömürlü oturum token'ı oluştur
  const sessionToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SESSION_EXPIRES_IN,
  });

  res.status(200).json({
    token: sessionToken,
    user: {
      id: user._id,
      email: user.email,
    },
  });
});

export { loginOrRegister, verifyLoginToken };