import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Gönderi içeriği boş olamaz.'],
      trim: true,
    },
    mediaUrl: {
      type: String,
      default: null,
    },
    mediaType: {
      type: String,
      enum: ['image', 'video', null],
      default: null,
    },
    likes: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    // Not: Gerçek sahibi anonim olduğu için author alanı eklemiyoruz.
    // Ancak bir gönderiyi kimin oluşturduğunu takip etmek isterseniz
    // author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    // şeklinde eklenebilir.
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);
export default Post;