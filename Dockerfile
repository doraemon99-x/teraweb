# Gunakan image Node.js resmi sebagai base image
FROM node:14

# Buat direktori kerja di dalam container
WORKDIR /usr/src/app

# Copy package.json dan package-lock.json ke direktori kerja
COPY package*.json ./

# Install dependensi aplikasi
RUN npm install

# Copy seluruh kode aplikasi ke dalam container
COPY . .

# Ekspose port yang akan digunakan oleh aplikasi
EXPOSE 3000

# Perintah untuk menjalankan aplikasi
CMD ["node", "index.js"]
