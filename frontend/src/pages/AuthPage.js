import React, { useState } from 'react';
import api from '../services/api';

function AuthPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!email.endsWith('@etu.edu.tr')) {
      setError('Lütfen geçerli bir @etu.edu.tr e-posta adresi girin.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/login', { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">Mask-Off</h1>
        <p className="text-center text-gray-600 mb-6">TOBB ETÜ Anonim Paylaşım Platformu</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@etu.edu.tr"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 mt-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Gönderiliyor...' : 'Giriş Yap / Kaydol'}
          </button>
        </form>
        {message && <p className="mt-4 text-green-600 bg-green-100 p-3 rounded-md">{message}</p>}
        {error && <p className="mt-4 text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
      </div>
    </div>
  );
}

export default AuthPage;