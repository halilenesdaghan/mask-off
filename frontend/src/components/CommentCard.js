import React from 'react';

const timeSince = (date) => {
    // ... PostCard'daki timeSince fonksiyonunun aynısı
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

function CommentCard({ comment }) {
  return (
    <div className="bg-gray-100 p-3 rounded-lg">
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-md">🤫</div>
        <div className="ml-2">
          <p className="font-semibold text-sm">Anonim</p>
          <p className="text-xs text-gray-500">{timeSince(comment.createdAt)}</p>
        </div>
      </div>
      <p className="text-gray-800 text-sm">{comment.content}</p>
    </div>
  );
}

export default CommentCard;