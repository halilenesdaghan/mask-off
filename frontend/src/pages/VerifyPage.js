import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function VerifyPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Bu backend endpoint'i aslında yok, backend'de GET /api/auth/verify/:token
        // direkt token ve kullanıcı bilgisi dönecek şekilde ayarlanmıştı.
        // Bu yüzden o endpoint'i direkt kullanıyoruz.
        const response = await api.get(`/auth/verify/${token}`);
        const { token: sessionToken, user } = response.data;
        login(sessionToken, user);
        navigate('/');
      } catch (error) {
        console.error("Doğrulama hatası:", error);
        alert('Geçersiz veya süresi dolmuş doğrulama linki. Lütfen tekrar giriş yapın.');
        navigate('/auth');
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Doğrulama yapılıyor, lütfen bekleyin...</p>
    </div>
  );
}

export default VerifyPage;