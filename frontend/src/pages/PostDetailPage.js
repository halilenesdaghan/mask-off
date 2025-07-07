import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useApi } from '../hooks/useApi'; // Yeni hook'umuzu import ediyoruz
import PostCard from '../components/PostCard';
import CommentCard from '../components/CommentCard';

// API fonksiyonlarını tanımlıyoruz
const getPostApi = (id) => api.get(`/posts/${id}`);
const getCommentsApi = (id) => api.get(`/posts/${id}/comments`);
const createCommentApi = (id, data) => api.post(`/posts/${id}/comments`, data);

function PostDetailPage() {
  const { id } = useParams();

  // Her API isteği için hook'u kullanıyoruz
  const { data: post, error: postError, loading: postLoading, request: fetchPost, setData: setPost } = useApi(getPostApi);
  const { data: comments, error: commentsError, loading: commentsLoading, request: fetchComments, setData: setComments } = useApi(getCommentsApi);
  
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Sayfa yüklendiğinde verileri çekiyoruz
    fetchPost(id);
    fetchComments(id);
  }, [id, fetchPost, fetchComments]);
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
        const createdComment = await createCommentApi(id, { content: newComment });
        // State'i manuel olarak güncelliyoruz
        setComments(prev => [createdComment.data, ...prev]);
        setPost(prev => ({ ...prev, commentCount: prev.commentCount + 1 }));
        setNewComment('');
    } catch(err) {
        console.error("Yorum gönderilemedi", err);
    } finally {
        setIsSubmitting(false);
    }
  }

  const isLoading = postLoading || commentsLoading;
  const error = postError || commentsError;

  if (isLoading) return <p className="text-center p-10">Yükleniyor...</p>;
  if (error) return <p className="text-center p-10 text-red-500">{error}</p>;
  if (!post) return <p className="text-center p-10">Gönderi bulunamadı.</p>;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto max-w-2xl p-4">
        <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Ana Akışa Dön</Link>
        <PostCard post={post} />
        
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mt-6">
            <h2 className="text-lg font-bold mb-4">Yorumlar ({comments?.length || 0})</h2>
            <form onSubmit={handleCommentSubmit} className="mb-4">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Yorumunu yaz..."
                    rows="2"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-700 disabled:bg-blue-300">
                    {isSubmitting ? "Gönderiliyor..." : "Yorum Yap"}
                </button>
            </form>

            <div className="space-y-3">
                {comments && comments.length > 0 ? (
                    comments.map(comment => <CommentCard key={comment._id} comment={comment} />)
                ) : (
                    <p className="text-gray-500">Henüz yorum yapılmamış. İlk yorumu sen yap!</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;