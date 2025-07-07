# Stage 1: Kurulum için Node imajını kullan
FROM node:18-alpine

# Uygulama için çalışma dizini oluştur
WORKDIR /usr/src/app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Proje dosyalarını kopyala
COPY . .

# Uygulamanın çalışacağı portu belirt
EXPOSE 5001

# Uygulamayı başlat
CMD ["npm", "start"]