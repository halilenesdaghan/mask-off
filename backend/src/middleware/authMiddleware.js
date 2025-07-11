import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password'); // -password gereksiz ama iyi alışkanlık
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Yetkisiz işlem, token geçersiz.');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Yetkisiz işlem, token bulunamadı.');
  }
});

export { protect };