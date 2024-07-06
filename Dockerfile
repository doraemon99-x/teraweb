# Gunakan image Node.js resmi sebagai base image
FROM node:14

# Buat direktori kerja di dalam container
WORKDIR /usr/src/app

# Install dependensi yang dibutuhkan untuk Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgbm-dev \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Download dan instal Chromium
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Set environment variable untuk Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/google-chrome-stable"

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
