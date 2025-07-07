import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  // Anonimlik için 'author' alanını şimdilik eklemiyoruz.
  // Gerekirse oturum sahibi kullanıcının ID'si eklenebilir.
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
  // Anonim beğeni için, beğenenlerin anonim ID'lerini tutabiliriz.
  // Örnek: likedBy: [String]
  commentCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Post = mongoose.model('Post', postSchema);
export default Post;