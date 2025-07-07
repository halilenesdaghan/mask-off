import { useState, useCallback } from 'react';

export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunc(...args);
      setData(result.data);
      return result.data; // Fonksiyonun çağrıldığı yerde de veriye erişebilmek için
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu.');
      throw err; // Hata yönetimini çağıran bileşene de bırakmak için
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return {
    data,
    error,
    loading,
    request,
    setData // Veriyi manuel olarak güncellemek için (örn. yeni yorum ekleme)
  };
};