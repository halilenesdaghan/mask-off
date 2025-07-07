import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PostCard from '../components/PostCard';
// CreatePostForm bileşenini de import edeceğiz

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/posts?page=${page}&limit=10`);
        setPosts(prev => [...prev, ...data.posts]);
      } catch (error) {
        console.error("Gönderiler çekilemedi:", error);
      }
      setLoading(false);
    };
    fetchPosts();
  }, [page]);

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="text-3xl font-bold my-4 text-center">Ana Akış</h1>
      {/* <CreatePostForm /> Buraya yeni gönderi formu gelecek */}
      <div className="space-y-4">
        {posts.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      {loading && <p className="text-center my-4">Yükleniyor...</p>}
      {/* Daha fazla yükle butonu eklenebilir */}
    </div>
  );
}

export default HomePage;