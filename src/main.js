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

      // 3. Update Title
      document.title = `${siteData.name.toUpperCase()}`;

      // 4. Update Favicon (logo di tab browser)
      // Kita gunakan querySelector karena mungkin Anda lupa menambahkan ID
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon) {
        favicon.href = siteData.file_logo;
      }
      
      // 5. Update Open Graph Image (untuk preview saat share di media sosial)
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.content = siteData.file_logo;
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
