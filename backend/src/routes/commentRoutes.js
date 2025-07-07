import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    // author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Gerekirse
}, {
    timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;