import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import PostCard from '../components/PostCard';
import CreatePostForm from '../components/CreatePostForm';
import { useAuth } from '../context/AuthContext';
import { ReactComponent as Logo } from '../assets/logo.svg'; //

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { logout } = useAuth();

  const fetchPosts = useCallback(async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/posts?page=${page}&limit=10`);
      setPosts(prev => [...prev, ...data.posts]);
      if (data.currentPage >= data.totalPages) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Gönderiler çekilemedi:", error);
    }
    setLoading(false);
  }, [page, hasMore]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto max-w-2xl p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-600">Mask-Off</h1>
            <button onClick={logout} className="text-sm font-semibold text-gray-600 hover:text-red-500">Çıkış Yap</button>
        </div>
      </nav>
      <main className="container mx-auto max-w-2xl p-4">
        <CreatePostForm onPostCreated={handlePostCreated} />
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
        {loading && <p className="text-center my-4 text-gray-500">Yükleniyor...</p>}
        {!loading && hasMore && (
          <div className="text-center my-6">
            <button onClick={() => setPage(p => p + 1)} className="bg-white px-4 py-2 border rounded-md shadow-sm hover:bg-gray-100">
              Daha Fazla Yükle
            </button>
          </div>
        )}
        {!loading && !hasMore && <p className="text-center my-4 text-gray-400">Gösterilecek başka gönderi yok.</p>}
      </main>
    </div>
  );
}

export default HomePage;