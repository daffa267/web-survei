import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import AOS from 'aos'
import 'aos/dist/aos.css'

async function fetchAndSetSiteInfo() {
  const apiUrl = 'https://admin.skm.tanjungpinangkota.go.id/api/site-setting';

  try {
    // 1. Ambil data dari API
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Gagal mengambil data dari network');
    }
    const result = await response.json();

    // 2. Pastikan data berhasil diterima
    if (result.success && result.data) {
      const siteData = result.data;

      // 3. Update Title (tanpa uppercase)
      document.title = siteData.name;

      let logoUrl = siteData.file_logo;

      // Periksa apakah URL-nya dimulai dengan 'http://'
      if (logoUrl && logoUrl.startsWith('http://')) {
        // Ganti 'http://' menjadi 'https://'
        logoUrl = logoUrl.replace('http://', 'https://');
      }

      // 4. Update Favicon dengan properti yang lebih lengkap
      let favicon = document.querySelector('link[rel="icon"]');
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = logoUrl;
      favicon.type = 'image/x-icon';
      favicon.sizes = 'any';
      
      // 5. Update Open Graph Image (untuk preview saat share di media sosial)
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.content = logoUrl;
      }

      console.log('Informasi situs berhasil diperbarui secara dinamis!');
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat memperbarui info situs:', error);
  }
}

fetchAndSetSiteInfo();

const app = createApp(App)

app.use(router)
app.use(AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true
}))

app.mount('#app')
