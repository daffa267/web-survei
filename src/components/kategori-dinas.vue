<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router'; 

const isLoading = ref(true);

const siteInfo = ref({
  logo: '/images/Logo-Pemko.png',
  name: '...',
  nama_aplikasi: 'Memuat...',
  telp: '',
  email: '',
  copyright: ''
});

const layananList = ref([]);
const opdNama = ref('Memuat...'); 
const route = useRoute(); 

const searchQuery = ref('');

const normalizeString = (s) => {
  if (!s) return '';
  return s.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase();
};

const filteredLayananList = computed(() => {
  const normalizedSearchQuery = normalizeString(searchQuery.value);

  if (!normalizedSearchQuery) {
    return layananList.value;
  }

  if (normalizedSearchQuery.length === 1) {
    return layananList.value.filter(item => {
      const name = normalizeString(item.name);
      const id = String(item.id || '').toLowerCase();
      return name.startsWith(normalizedSearchQuery) || id.startsWith(normalizedSearchQuery);
    });
  }

  const searchKeywords = normalizedSearchQuery.split(/\s+/).filter(Boolean);
  return layananList.value.filter(item => {
    const name = normalizeString(item.name);
    const id = String(item.id || '').toLowerCase();
    const words = name.split(/[^\p{L}\p{N}]+/u).filter(Boolean);

    return searchKeywords.every(keyword => {
      if (id.startsWith(keyword)) return true;
      return words.some(w => w.startsWith(keyword));
    });
  });
});

onMounted(async () => {
  window.scrollTo(0, 0);
  
  try {
    const siteResp = await fetch('https://admin.skm.tanjungpinangkota.go.id/api/site-setting');
    if (siteResp.ok) {
      const siteResult = await siteResp.json();
      if (siteResult.success && siteResult.data) {
        const data = siteResult.data;
        await new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = () => {
                console.error("Gagal memuat logo, menggunakan logo default.");
                resolve();
            };
            img.src = data.file_logo;
        });
        siteInfo.value = {
          logo: data.file_logo,
          name: data.name.toUpperCase(),
          nama_aplikasi: data.nama_aplikasi,
          telp: data.telp,
          email: data.email,
          copyright: data.copyright
        };
      }
    } else {
        console.error("Gagal mengambil data pengaturan situs: Network response was not ok");
    }

    const id_opd = route.params.id;
    if (route.query && route.query.name) {
      opdNama.value = route.query.name;
    }
    if (!id_opd) {
      console.error("ID OPD tidak ditemukan di URL");
      opdNama.value = "Kategori Layanan";
      layananList.value = [];
      return;
    }
    
    const response = await fetch(`https://admin.skm.tanjungpinangkota.go.id/api/form/layanan-opd-option?id_opd=${id_opd}`);
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data && result.data.length > 0) {
        layananList.value = result.data;
        if (!route.query.name) {
          const possibleName = result.data[0]?.opd_name || result.data[0]?.opd || result.data[0]?.name;
          opdNama.value = possibleName || `Layanan OPD`;
        }
      } else {
          opdNama.value = route.query.name || "Belum Ada Layanan";
          layananList.value = [];
      }
    } else {
        console.error("Gagal mengambil data layanan OPD: Network response was not ok");
        opdNama.value = "Gagal Memuat Layanan";
    }
  } catch (err) {
    console.error('Gagal mengambil data halaman:', err);
    opdNama.value = "Terjadi Kesalahan";
  } finally {
    isLoading.value = false;
  }

  let isClickScrolling = false;
  let scrollTimeout = null;
  const navItems = document.querySelectorAll(".nav-item");
  const mobileNavItems = document.querySelectorAll(".mobile-nav-item");
  const mobileMenu = document.getElementById("mobileMenu");
  const navigateToHomeSection = (navName) => {
    if (!navName) return;
    isClickScrolling = true;
    clearTimeout(scrollTimeout);
    window.location.href = `/${navName === 'beranda' ? '' : '#' + navName}`;
    scrollTimeout = setTimeout(() => {
      isClickScrolling = false;
    }, 800);
  };
  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const navName = this.getAttribute("data-nav");
      navigateToHomeSection(navName);
    });
  });
  mobileNavItems.forEach((item) => {
    item.addEventListener("click", function (e) {
        e.preventDefault();
        const navName = this.getAttribute("data-nav");
        navigateToHomeSection(navName);
        setTimeout(() => mobileMenu.classList.add("hidden"), 300);
    });
  });

});

const toggleMobileMenu = () => {
  const menu = document.getElementById("mobileMenu");
  if (menu) {
    menu.classList.toggle("hidden");
  }
};
</script>

<template>
  <Transition name="loader-fade">
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner-container">
      </div>
    </div>
  </Transition>

  <div class="content-wrapper">
    <header class="w-full pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8 py-1 sm:py-2 fixed top-0 left-0 z-50 scrolled">
      <div class="flex flex-row justify-between items-center w-full max-w-[1280px] mx-auto">
        <router-link to="/" class="flex flex-row items-center gap-3 sm:gap-1 h-20">
          <img :src="siteInfo.logo" class="h-[85px] w-auto" alt="Logo Pemko" />
          <div class="flex flex-col">
            <span class="text-[21px] sm:text-[24px] font-semibold leading-tight custom-gradient-text">{{ siteInfo.nama_aplikasi }}</span>
            <span class="text-[16px] font-semibold leading-tight custom-gradient-text">Pemko Tanjungpinang</span>
          </div>
        </router-link>

        <nav class="hidden lg:flex flex-row items-center gap-6 xl:gap-8 relative">
          <a href="/#beranda" class="px-4 py-2 relative z-10 text-white font-semibold text-sm hover:text-[#01c4c6] transition-colors nav-item" data-nav="beranda">
            <span class="drop-shadow-[0_2px_2px_rgba(0,0,0,0.37)]">Beranda</span>
          </a>
          <a href="/#tentang" class="px-4 py-2 relative z-10 text-white font-semibold text-sm hover:text-[#01c4c6] transition-colors nav-item" data-nav="tentang">
            <span class="drop-shadow-[0_2px_2px_rgba(0,0,0,0.37)]">Tentang</span>
          </a>
          <a href="/#unsur" class="px-4 py-2 relative z-10 text-white font-semibold text-sm hover:text-[#01c4c6] transition-colors nav-item" data-nav="unsur">
            <span class="drop-shadow-[0_2px_2px_rgba(0,0,0,0.37)]">Unsur Survei</span>
          </a>
        </nav>
        <button class="lg:hidden p-2 text-white" @click="toggleMobileMenu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div id="mobileMenu" class="hidden lg:hidden mt-4 pb-4 px-4">
        <div class="relative flex flex-col gap-2">
          <button data-nav="beranda" class="mobile-nav-item flex items-center gap-2 px-4 py-2 font-semibold text-sm text-left transition-colors z-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Beranda
          </button>
          <button data-nav="tentang" class="mobile-nav-item flex items-center gap-2 px-4 py-2 font-semibold text-sm text-left transition-colors z-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tentang
          </button>
          <button data-nav="unsur" class="mobile-nav-item flex items-center gap-2 px-4 py-2 font-semibold text-sm text-left transition-colors z-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Unsur Survei
          </button>
        </div>
      </div>
      </header>

    <main class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-42">
      <div class="text-center mb-12 relative">
        <h1 class="text-[28px] sm:text-[32px] lg:text-[40px] font-semibold text-[#04b0b1] leading-tight mb-6">
          {{ opdNama }}
        </h1>
        <div class="w-full flex sm:justify-end mt-4">
            <div class="relative w-full sm:w-48 lg:w-64">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#00c8c9]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
              </svg>
            </span>
            <input v-model="searchQuery" type="search" placeholder="Cari Layanan..." class="search-input pl-9 pr-3 py-2 border border-[#00c8c9] rounded-lg outline-none text-sm w-full focus:ring-1 focus:ring-[#00c8c9]" />
          </div>
        </div>
      </div>

      <div v-if="filteredLayananList.length > 0" class="w-full max-w-4xl mx-auto flex flex-col gap-4">
        <div v-for="layanan in filteredLayananList" :key="layanan.id" 
            class="list-item-custom bg-white p-4 rounded-lg custom-shadow flex items-center justify-between gap-4 transition-all duration-300">
          <div class="flex items-center gap-4">
            <div class="bg-gradient-to-br from-teal-50 to-cyan-100 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 8h.01M12 12h.01M15 12h.01M9 12h.01" />
              </svg>
            </div>
            <h3 class="text-gray-800 font-semibold text-sm sm:text-base">{{ layanan.name }}</h3>
          </div>
          <router-link :to="{ path: '/list-survey/' + layanan.id, query: { opd_name: opdNama, service_name: layanan.name } }" class="button-detail bg-white text-[#00c8c9] px-5 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold border-2 border-[#00C9CA] whitespace-nowrap">
            Pilih Layanan
          </router-link>
          </div>
      </div>
      <div v-else class="text-center text-gray-500 py-10">
        <p>Tidak ada layanan yang tersedia untuk kategori ini.</p>
      </div>
    </main>
  </div>

  <footer class="w-full relative">
    <img src="/images/Group Footer.svg" class="w-[150vw] h-[120%] sm:h-auto sm:w-auto sm:min-w-[108vw] absolute bottom-0 -right-0 sm:-right-10 -z-10 object-cover" alt="Footer Background" />
    <div class="relative w-full max-w-[1280px] mx-auto px-8 pt-20 pb-6 sm:pt-24 lg:pt-28">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-8">
            <div class="lg:col-span-1 lg:ml-[-10px]">
                <h3 class="text-white font-semibold text-2xl mb-4">Hubungi Kami</h3>
                <div class="text-white/90 text-sm leading-relaxed">
                    <p class="mb-2">Dinas Komunikasi dan Informatika Kota Tanjungpinang</p>
                    <p class="mb-4">
                        Jl. Daeng Celak, Gedung C Lantai 1 & 2, Senggarang, Kecamatan Tanjungpinang Kota, Tanjungpinang, Kepulauan Riau 29111
                    </p>
                    <p class="mb-2">{{ siteInfo.telp }}</p>
                    <p>{{ siteInfo.email }}</p>
                </div>
            </div>
            <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="md:ml-12">
                    <h3 class="text-white font-semibold text-2xl mb-4">SKM</h3>
                    <div class="text-white/90 text-sm leading-relaxed space-y-2">
                        <p><a href="/" class="hover:text-white transition-colors">Home</a></p>
                        <p><a href="/#tentang" class="hover:text-white transition-colors">Tentang</a></p>
                        <p><a href="/#unsur" class="hover:text-white transition-colors">Unsur Survei</a></p>
                    </div>

                    <div class="mt-6 pt-4 border-t border-white/20">
                        <router-link to="/login" class="group relative inline-flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-sm border border-white/40 rounded-xl text-white font-bold text-sm overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-white/10 hover:border-white/60">
                            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            
                            <div class="relative p-1.5 bg-gradient-to-br from-white/30 to-white/10 rounded-lg transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            
                            <span class="relative z-10">
                                Portal Admin
                            </span>
                            
                            <div class="relative ml-2 group-hover:translate-x-1.5 transition-transform duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </router-link>
                    </div>
                </div>
                <div>
                    <h3 class="text-center text-white font-semibold text-2xl mb-4">Kotak Masukan</h3>
                    <form action="#" method="POST" class="space-y-3">
                        <div class="flex flex-col sm:flex-row gap-3">
                            <input type="text" name="nama" placeholder="Nama" class="form-input w-full bg-white/20 border border-white/30 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-white" />
                            <input type="text" name="email_hp" placeholder="Email/No. HP" class="form-input w-full bg-white/20 border border-white/30 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-white" />
                        </div>
                        <div>
                            <input type="text" name="subjek" placeholder="Subjek" class="form-input w-full bg-white/20 border border-white/30 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-white" />
                        </div>
                        <div>
                            <textarea name="pesan" rows="4" placeholder="Pesan..." class="form-input w-full bg-white/20 border border-white/30 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:border-white"></textarea>
                        </div>
                        <div>
                            <button type="submit" class="w-full bg-white/90 text-[#007576] font-bold py-2 px-4 rounded-md hover:bg-white transition-colors">
                                Kirim
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="mt-0 pt-8 text-center">
            <p class="text-white text-[13px] sm:text-[14px] lg:text-[15px]">
                {{ siteInfo.copyright }}
            </p>
        </div>
    </div>
  </footer>
</template>
<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f2fffc;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner-container {
  width: 80px;
  height: 80px;
  border: 8px solid rgba(0, 192, 201, 0.2);
  border-left-color: #00c8c9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loader-fade-leave-active {
  transition: opacity 0.5s ease-out;
}

.loader-fade-leave-to {
  opacity: 0;
}

::placeholder {
  color: rgba(255, 255, 255, 0.8) !important;
}

html,
body {
  width: 100%;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

body {
  font-family: Archivo, sans-serif;
  background-color: #f2fffc;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}

.custom-shadow {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.card-image {
  filter: drop-shadow(0 3.4px 2px rgba(0, 0, 0, 0.359));
}

header {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0) 100%)
    !important;
  backdrop-filter: blur(0);
  transition: all 0.3s ease-in-out;
}

header.scrolled {
  background: linear-gradient(90deg, #f2fffc 25%, rgba(57, 211, 211, 0.748) 100%)
    !important;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07);
}

.custom-gradient-text {
  background: linear-gradient(to right, #007c7e, #00b9b9);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.content-wrapper {
  flex: 1 0 auto;
}

.list-item-custom:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

footer {
  flex-shrink: 0;
}

.button-detail {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.button-detail:hover {
  background-color: #00c8c9;
  color: #fff;
}

.mobile-nav-item {
  color: #01c4c6;
}

.mobile-nav-item.active {
  color: #fff;
}

@media (max-width: 1023px) {
  .content-wrapper > header {
    background: linear-gradient(90deg, #f2fffc 25%, rgba(57, 211, 211, 0.748)
      100%) !important;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07);
  }
}

.search-input::placeholder {
  color: rgba(0, 200, 201, 0.55) !important;
}

.search-input::-webkit-input-placeholder {
  color: rgba(0, 200, 201, 0.55) !important;
}

.search-input::-moz-placeholder {
  color: rgba(0, 200, 201, 0.55) !important;
}

.search-input:-ms-input-placeholder {
  color: rgba(0, 200, 201, 0.55) !important;
}

.search-input:-moz-placeholder {
  color: rgba(0, 200, 201, 0.55) !important;
}

.search-input {
  color: #04b0b1 !important;
  caret-color: #04b0b1 !important;
}
</style>