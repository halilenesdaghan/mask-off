import asyncHandler from 'express-async-handler';
import Post from '../models/postModel.js';
import { uploadToS3 } from '../services/s3Service.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content && !req.file) {
    res.status(400);
    throw new Error('Gönderi içeriği veya medya dosyası gereklidir.');
  }

  let mediaUrl = null;
  let mediaType = null;

  if (req.file) {
    const result = await uploadToS3(req.file);
    mediaUrl = result.Location;
    mediaType = req.file.mimetype.startsWith('image') ? 'image' : 'video';
  }

  const post = await Post.create({
    content: content || '', // İçerik boş olabilir ama null olmasın
    mediaUrl,
    mediaType,
    // author: req.user.id // Korumalı rotadan gelen kullanıcı ID'si
  });

  res.status(201).json(post);
});

// @desc    Get all posts with pagination
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const skip = (page - 1) * limit;

  const posts = await Post.find({}).sort({ createdAt: -1 }).limit(limit).skip(skip);
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
  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Gönderi bulunamadı.');
  }
});

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Public (veya Private)
const likePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post) {
        // Bu basit bir beğeni artırma işlemidir.
        // Gelişmiş sistemde bir kullanıcının bir kez beğenmesi sağlanır.
        post.likes += 1;
        await post.save();
        res.json({ likes: post.likes });
    } else {
        res.status(404);
        throw new Error('Gönderi bulunamadı.');
    }
});


export { createPost, getPosts, getPostById, likePost };