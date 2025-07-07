import asyncHandler from 'express-async-handler';
import Post from '../models/postModel.js';
import { uploadToS3 } from '../services/s3Service.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private (Giriş yapmış kullanıcılar)
const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content && !req.file) {
    res.status(400);
    throw new Error('Gönderi içeriği veya medya dosyası gereklidir.');
  }
  
  let mediaUrl = null;
  let mediaType = null;

  if (req.file) {
    try {
      const result = await uploadToS3(req.file);
      mediaUrl = result.Location;
      mediaType = req.file.mimetype.startsWith('image') ? 'image' : 'video';
    } catch (error) {
        res.status(500);
        throw new Error('Medya dosyası yüklenirken hata oluştu.');
    }
  }

  const post = await Post.create({
    content,
    mediaUrl,
    mediaType,
    // author: req.user._id // Gerekirse kullanıcı ID'si eklenebilir
  });

  res.status(201).json(post);
});

// @desc    Get all posts with pagination
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
  
  const totalPosts = await Post.countDocuments();

  res.status(200).json({
    posts,
    currentPage: page,
    totalPages: Math.ceil(totalPosts / limit),
  });
});

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if(post) {
        res.status(200).json(post);
    } else {
        res.status(404);
        throw new Error('Gönderi bulunamadı.');
    }
});

// @desc    Like/unlike a post
// @route   POST /api/posts/:id/like
// @access  Public (for now, can be protected)
const toggleLike = asyncHandler(async (req, res) => {
    // Not: Bu basit implementasyon, bir kullanıcının birden fazla kez beğenmesini engellemez.
    // Engellemek için client'tan gelen anonim bir session/device ID kullanılabilir ve 
    // post'un 'likedBy' dizisinde bu ID kontrol edilebilir.
    
    const post = await Post.findById(req.params.id);
    if (!post) {
        res.status(404);
        throw new Error('Gönderi bulunamadı.');
    }

    // Basit bir artırma/azaltma. Gerçek senaryoda client'ın beğenip beğenmediği bilgisi gerekir.
    // Şimdilik sadece artırıyoruz.
    post.likes += 1;
    await post.save();

    res.status(200).json({ likes: post.likes });
});

// Controller'dan export etmeyi unutmayın: export { ..., toggleLike };

export { createPost, getPosts, getPostById };