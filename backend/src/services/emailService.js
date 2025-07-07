// Bu dosya gerçek bir email servisi (Nodemailer vb.) ile değiştirilebilir.
export const sendLoginEmail = async (to, url) => {
  console.log('--- EMAIL GÖNDERİMİ SİMÜLASYONU ---');
  console.log(`Alıcı: ${to}`);
  console.log(`Giriş Linki: ${url}`);
  console.log('------------------------------------');
  // Nodemailer entegrasyonu burada yapılabilir.
  return Promise.resolve();
};