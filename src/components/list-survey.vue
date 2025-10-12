<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'; 

const isLoading = ref(true);

const siteInfo = ref({
  logo: '/images/Logo-Pemko.png',
  name: '...',
  nama_aplikasi: 'Memuat...',
  telp: '',
  email: '',
  copyright: ''
});

const surveyList = ref([]);
const pageTitle = ref('Memuat...'); 
const opdName = ref(''); 
const idOPD = ref(null);
const searchQuery = ref('');
const route = useRoute(); 
const router = useRouter();

const normalizeString = (s) => {
  if (!s) return '';
  return s.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase();
};

const filteredSurveyList = computed(() => {
  const normalizedSearchQuery = normalizeString(searchQuery.value);

  if (!normalizedSearchQuery) {
    return surveyList.value;
  }
  return surveyList.value.filter(item => {
    const name = normalizeString(item.name);
    const periode = normalizeString(item.periode);
    return name.includes(normalizedSearchQuery) || periode.includes(normalizedSearchQuery);
  });
});

onMounted(async () => {
  opdName.value = route.query.name || '';
  // ID OPD sekarang diambil dari data API jika tidak ada di query, untuk konsistensi
  // idOPD.value = route.query.id_opd || null;

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

    const id_layanan_opd = route.params.id;
    if (!id_layanan_opd) {
      console.error("ID Layanan OPD tidak ditemukan di URL");
      pageTitle.value = "Halaman Tidak Ditemukan";
      surveyList.value = [];
      return;
    }
  
    const response = await fetch(`https://admin.skm.tanjungpinangkota.go.id/api/form/survey-option?id_layanan_opd=${id_layanan_opd}`);
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data && result.data.length > 0) {
        surveyList.value = result.data.map(survey => ({
          ...survey,
          nilai_ikm: (Math.random() * (4.0 - 2.5) + 2.5).toFixed(2) 
        }));
        pageTitle.value = `Survei untuk "${result.data[0].layanan_opd}"`;
        // Selalu ambil ID OPD dari data API sebagai sumber kebenaran
        idOPD.value = result.data[0].id_opd;
      } else {
        pageTitle.value = "Belum Ada Survei Tersedia";
        surveyList.value = [];
      }
    } else {
        console.error("Gagal mengambil data survei: Network response was not ok");
        pageTitle.value = "Gagal Memuat Data Survei";
    }

  } catch (err) {
    console.error('Gagal mengambil data halaman:', err);
    pageTitle.value = "Terjadi Kesalahan";
  } finally {
    isLoading.value = false;
  }
});

const handleNavClick = (e, isMobile = false) => {
    e.preventDefault();
    const navName = e.currentTarget.getAttribute("data-nav");
    if (!navName) return;
    window.location.href = `/${navName === 'beranda' ? '' : '#' + navName}`;
    if (isMobile) {
        const mobileMenu = document.getElementById("mobileMenu");
        setTimeout(() => mobileMenu?.classList.add("hidden"), 300);
    }
};

const toggleMobileMenu = () => {
  document.getElementById("mobileMenu")?.classList.toggle("hidden");
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
        <router-link to="/" class="flex flex-row items-center gap-3 sm:gap-4 h-20">
          <img :src="siteInfo.logo" class="h-[60px] w-auto" alt="Logo Pemko" />
          <div class="flex flex-col">
            <span class="text-[24px] font-semibold leading-tight custom-gradient-text">{{ siteInfo.name }}</span>
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
          <button data-nav="beranda" class="mobile-nav-item flex items-center gap-2 px-4 py-2 font-semibold text-sm text-left transition-colors z-10">Beranda</button>
          <button data-nav="tentang" class="mobile-nav-item flex items-center gap-2 px-4 py-2 font-semibold text-sm text-left transition-colors z-10">Tentang</button>
          <button data-nav="unsur" class="mobile-nav-item flex items-center gap-2 px-4 py-2 font-semibold text-sm text-left transition-colors z-10">Unsur Survei</button>
        </div>
      </div>
      </header>

    <main class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-28">
        <div class="text-center mb-12 relative">
          <h1 class="text-[28px] sm:text-[32px] lg:text-[40px] font-semibold text-[#04b0b1] leading-tight mb-6">
            {{ pageTitle }}
          </h1>
          <div class="w-full flex sm:justify-end mt-4">
            <div class="relative w-full sm:w-48 lg:w-64">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#00c8c9]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
                </svg>
              </span>
              <input v-model="searchQuery" type="search" placeholder="Cari nama survei atau periode..." class="search-input pl-9 pr-3 py-2 border border-[#00c8c9] rounded-lg outline-none text-sm w-full focus:ring-1 focus:ring-[#00c8c9]" />
            </div>
          </div>
        </div>

    <div v-if="filteredSurveyList.length > 0" class="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 lg:gap-y-10 lg:gap-x-20 mb-16 max-w-7xl mx-auto justify-items-center">
            
      <div v-for="survey in filteredSurveyList" :key="survey.id" 
        class="card-oceanic-texture relative overflow-hidden rounded-xl shadow-md border border-gray-200/50 transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1.5 h-[230px] w-[170px] sm:h-[250px] sm:w-[200px] lg:h-[280px] lg:w-[259px]">
        
        <div class="w-full h-full p-4 flex flex-col items-center justify-between text-center">
            <div>
                <h3 class="text-[#209fa0] font-bold text-xs sm:text-sm leading-tight">{{ survey.name }}</h3>
                <p class="inline-block text-[10px] sm:text-xs font-semibold text-teal-800 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 my-1 sm:my-2" style="background-color: rgba(0,200,201,0.32);">
                    Periode: {{ survey.periode }}
                </p>
            </div>

            <div class="relative w-24 h-24 sm:w-28 sm:h-28 my-2">
                <svg class="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" class="stroke-current text-gray-200" stroke-width="10" fill="transparent"></circle>
                    <circle cx="50" cy="50" r="40" class="progress-circle stroke-current text-[#00c8c9]" stroke-width="10" fill="transparent"
                            stroke-linecap="round"
                            transform="rotate(-90 50 50)"
                            :style="{ 'stroke-dashoffset': `calc(283 - (283 * ${survey.nilai_ikm || 0}) / 4)` }">
                    </circle>
                    <text x="50" y="52" text-anchor="middle" dominant-baseline="middle" class="text-2xl font-bold fill-current text-[#007c7e]">
                        {{ survey.nilai_ikm || 'N/A' }}
                    </text>
                </svg>
            </div>

            <router-link :to="{ path: '/data-responden/' + survey.id, query: { name: opdName, service_id: route.params.id } }" class="button-detail bg-white text-[#00c8c9] px-5 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold border-2 border-[#00C9CA]">
                Isi Survei
            </router-link>
            </div>
    </div>

    </div>
    <div v-else class="text-center text-gray-500 py-10">
            <p>Tidak ada survei yang ditemukan atau tersedia untuk layanan ini.</p>
        </div>
        </main>
  </div>

  <footer class="w-full relative">
    </footer>
</template>

<style>
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
  to { transform: rotate(360deg); }
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

  html, body {
    width: 100%;
    overflow-x: hidden;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: "Archivo", sans-serif;
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
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%) !important;
    backdrop-filter: blur(0px);
    transition: all 0.3s ease-in-out;
  }

  header.scrolled {
    background: linear-gradient(90deg, #f2fffc 25%, rgba(57, 211, 211, 0.748) 100%) !important;
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

  .card-oceanic-texture {
    background-color: #ffffff;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 220'%3e%3cpath fill='%23E2FEFE' d='M 400,220 H 200 V 110 C 270,90 330,170 400,130 Z'/%3e%3cpath fill='%23BFFDFD' d='M 400,220 H 200 V 120 C 280,100 320,180 400,140 Z'/%3e%3cpath fill='%23E2FEFE' d='M 200,110 C 130,130 70,70 0,90 V 220 H 200 Z'/%3e%3cpath fill='%23BFFDFD' d='M 200,120 C 120,140 80,80 0,100 V 220 H 200 Z'/%3e%3c/svg%3e");    
    background-repeat: no-repeat;
    background-size: 200% auto;
    background-position: 99% 100%;
    
    transition: background-position 0.8s cubic-bezier(0.25, 1, 0.5, 1),
                transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }

  @media (max-width: 640px) {
    .card-oceanic-texture {
      background-position: 99% 101%;
    }
    .card-oceanic-texture:hover {
      background-position: 1% 101%;
    }
  }

  @media (min-width: 641px) {
    .card-oceanic-texture:hover {
      background-position: 0% 100%;
    }
  }

  footer {
    flex-shrink: 0;
  }

  .button-detail {
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .button-detail:hover {
    background-color: #00c8c9;
    color: white;
  }

  .mobile-nav-item {
    color: #01c4c6;
  }

  .mobile-nav-item.active {
    color: white;
  }

  @media (max-width: 1023px) {
    .content-wrapper > header {
      background: linear-gradient(90deg, #f2fffc 25%, rgba(57, 211, 211, 0.748) 100%) !important;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07);
    }
  }

  .search-input::placeholder {
    color: rgba(0, 200, 201, 0.55) !important;
  }

  .search-input {
    color: #04b0b1 !important;
    caret-color: #04b0b1 !important;
  }
  
  @keyframes progress-animation {
    from {
      stroke-dashoffset: 283;
    }
  }

  .progress-circle {
    stroke-dasharray: 283;
    transition: stroke-dashoffset 1.5s ease-out;
  }
</style>