const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // Mengatur Header CORS agar bisa diakses dari aplikasi/domain lain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    // Menemukan jalur file free-proxy-list.json yang berada di dalam folder api
    const filePath = path.join(process.cwd(), 'api', 'free-proxy-list.json');
    
    // Membaca file secara lokal
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    const rawProxies = data.proxies || [];

    // Menyaring proxy dengan latensi (timeout) di bawah 2000ms
    const filteredProxies = rawProxies
      .filter(proxy => proxy.timeout < 2000)
      .map(proxy => ({
        host: proxy.ip,
        port: parseInt(proxy.port, 10)
      }));

    // Mengembalikan hasil filter dalam format JSON bersih
    res.status(200).json(filteredProxies);
    
  } catch (error) {
    res.status(500).json({ 
      error: "Gagal memproses file proxy lokal", 
      details: error.message 
    });
  }
};
