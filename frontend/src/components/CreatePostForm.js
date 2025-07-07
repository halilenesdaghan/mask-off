import React, { useState } from 'react';
import api from '../services/api';

function CreatePostForm({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !media) {
      setError('Lütfen bir şeyler yazın veya bir medya dosyası seçin.');
      return;
    }
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('content', content);
    if (media) {
      formData.append('media', media);
    }

    try {
      const { data } = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onPostCreated(data); // Yeni postu anasayfa listesine ekle
      // Formu temizle
      setContent('');
      setMedia(null);
      setPreview('');
    } catch (err) {
      setError(err.response?.data?.message || 'Gönderi oluşturulamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Aklından ne geçiyor?"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        ></textarea>
        {preview && (
          <div className="my-2">
            <img src={preview} alt="Önizleme" className="rounded-lg max-h-48" />
          </div>
        )}
        <div className="flex justify-between items-center mt-3">
          <input type="file" id="media-upload" accept="image/*,video/*" onChange={handleMediaChange} className="hidden" />
          <label htmlFor="media-upload" className="cursor-pointer text-blue-600 hover:text-blue-800">
            📷 Fotoğraf/Video Ekle
          </label>
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
            {loading ? 'Paylaşılıyor...' : 'Paylaş'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
}

export default CreatePostForm;