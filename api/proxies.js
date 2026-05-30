export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    // Mengubah parameter &format=json agar ProxyScrape mengirimkan data detail termasuk latensi
    const url = "https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&proxy_format=protocolipport&format=json&protocol=socks5&country=vn%2Cid%2Csg";
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Gagal mengambil data dari ProxyScrape");
    
    const data = await response.json();
    
    // Pastikan struktur data dari ProxyScrape memiliki array 'proxies'
    const rawProxies = data.proxies || [];

    // Filter proxy yang memiliki latensi (timeout) di bawah 2000ms
    const filteredProxies = rawProxies
      .filter(proxy => proxy.timeout < 2000) 
      .map(proxy => ({
        host: proxy.ip,
        port: parseInt(proxy.port, 10)
      }));

    res.status(200).json(filteredProxies);

  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan pada server", details: error.message });
  }
}
