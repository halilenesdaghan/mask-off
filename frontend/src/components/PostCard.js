import React from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const timeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "az önce";
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " yıl önce";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " ay önce";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " gün önce";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " saat önce";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " dakika önce";
  return Math.floor(seconds) + " saniye önce";
};

function PostCard({ post }) {
  const [likes, setLikes] = React.useState(post.likes);

  const handleLike = async () => {
    try {
      // Backend'deki toggleLike sadece artırdığı için, biz de burada sadece artırıyoruz.
      // Gerçek bir toggle için backend'in de desteklemesi gerekir.
      const { data } = await api.post(`/posts/${post._id}/like`);
      setLikes(data.likes);
    } catch (error) {
      console.error('Beğenme hatası:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xl">🤫</div>
        <div className="ml-3">
          <p className="font-bold">Anonim</p>
          <p className="text-sm text-gray-500">{timeSince(post.createdAt)}</p>
        </div>
      </div>
      <p className="mb-3 text-gray-800 whitespace-pre-wrap">{post.content}</p>
      {post.mediaUrl && (
        <div className="my-3 bg-gray-100 flex justify-center">
          {post.mediaType === 'image' ? (
            <img src={post.mediaUrl} alt="Gönderi medyası" className="rounded-lg max-h-96 object-contain" />
          ) : (
            <video src={post.mediaUrl} controls className="rounded-lg w-full"></video>
          )}
        </div>
      )}
      <div className="flex items-center text-gray-600 space-x-6 border-t pt-3 mt-3">
        <button onClick={handleLike} className="flex items-center space-x-1 hover:text-red-500 transition-colors">
          <span>❤️</span>
          <span>{likes}</span>
        </button>
        <Link to={`/posts/${post._id}`} className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
          <span>💬</span>
          <span>{post.commentCount} Yorum</span>
        </Link>
      </div>
    </div>
  );
}

export default PostCard;