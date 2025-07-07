import asyncHandler from 'express-async-handler';
import Comment from '../models/commentModel.js';
import Post from '../models/postModel.js';

// @desc    Create a comment on a post
// @route   POST /api/posts/:id/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { id: postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    res.status(404);
    throw new Error('Gönderi bulunamadı.');
  }

  const comment = await Comment.create({
    postId,
    content,
    // author: req.user.id
  });

  // İlgili post'un yorum sayısını artır
  post.commentCount += 1;
  await post.save();

  res.status(201).json(comment);
});

// @desc    Get comments for a specific post
// @route   GET /api/posts/:id/comments
// @access  Public
const getCommentsForPost = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ postId: req.params.id }).sort({ createdAt: -1 });
  res.status(200).json(comments);
});

export { createComment, getCommentsForPost };