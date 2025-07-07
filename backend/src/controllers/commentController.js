import asyncHandler from 'express-async-handler';
import Comment from '../models/commentModel.js';
import Post from '../models/postModel.js';

// @desc    Create a comment on a post
// @route   POST /api/posts/:id/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
        res.status(404);
        throw new Error('Gönderi bulunamadı.');
    }
    
    const comment = await Comment.create({
        postId,
        content,
        // author: req.user._id // Gerekirse
    });
    
    // Gönderinin yorum sayısını güncelle
    post.commentCount = await Comment.countDocuments({ postId });
    await post.save();

    res.status(201).json(comment);
});

// @desc    Get comments for a post
// @route   GET /api/posts/:id/comments
// @access  Public
const getComments = asyncHandler(async (req, res) => {
    const comments = await Comment.find({ postId: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json(comments);
});

export { createComment, getComments };