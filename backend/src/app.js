import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Rota dosyaları
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';

// .env dosyasını yükle
dotenv.config();

// Veritabanına bağlan
connectDB();

const app = express();

// Güvenlik için helmet
app.use(helmet());

// Gelen isteklerin body'sini parse etmek için (JSON)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS'u etkinleştir
app.use(cors());

// Ana Rotalar
app.get('/api', (req, res) => {
  res.send('API çalışıyor...');
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Hata Middleware'leri
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () =>
  console.log(`Sunucu ${process.env.NODE_ENV} modunda ${PORT} portunda çalışıyor.`)
);