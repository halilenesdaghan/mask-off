import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Rota dosyaları
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
// Yorum rotasını da ekleyeceğiz

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // CORS'u etkinleştir
app.use(helmet()); // Güvenlik başlıkları

// Ana Rotalar
app.get('/', (req, res) => {
  res.send('API çalışıyor...');
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
// app.use('/api/comments', commentRoutes); // Yorum rotalarını da ekle

// Hata Middleware'leri
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Sunucu ${process.env.NODE_ENV} modunda ${PORT} portunda çalışıyor.`)
);