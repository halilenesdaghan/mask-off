import axios from 'axios';

const api = axios.create({
  // Docker içinde servisler birbirini servis adıyla tanır.
  // Ancak tarayıcıdan istek atıldığı için localhost kullanmalıyız.
  baseURL: 'http://localhost:5001/api', // Backend API adresimiz
});

// Oturum token'ını her isteğe otomatik eklemek için interceptor kullanabiliriz.
// AuthContext'te bu mantığı zaten kurduk.

export default api;