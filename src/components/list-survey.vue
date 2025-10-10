<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router'; 

// --- STATE MANAGEMENT ---
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
const searchQuery = ref('');
const route = useRoute(); 

// --- COMPUTED PROPERTY FOR SEARCH ---
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

// --- LIFECYCLE HOOK ---
onMounted(async () => {
  // 1. Fetch Site Settings 
  try {
    const siteResp = await fetch('https://admin.skm.tanjungpinangkota.go.id/api/site-setting');
    if (!siteResp.ok) throw new Error('Network response was not ok');
    const siteResult = await siteResp.json();
    if (siteResult.success && siteResult.data) {
      const data = siteResult.data;
      siteInfo.value = {
        logo: data.file_logo || siteInfo.value.logo,
        name: (data.name || siteInfo.value.name).toUpperCase(),
        nama_aplikasi: data.nama_aplikasi || siteInfo.value.nama_aplikasi,
        telp: data.telp || siteInfo.value.telp,
        email: data.email || siteInfo.value.email,
        copyright: data.copyright || siteInfo.value.copyright
      };
    }
  } catch (err) {
    console.error('Gagal mengambil data pengaturan situs:', err);
  }

  // 2. Fetch Survey List based on ID from URL
  const id_layanan_opd = route.params.id;

  if (!id_layanan_opd) {
    console.error("ID Layanan OPD tidak ditemukan di URL");
    pageTitle.value = "Halaman Tidak Ditemukan";
    return;
  }
  
  try {
    const response = await fetch(`https://admin.skm.tanjungpinangkota.go.id/api/form/survey-option?id_layanan_opd=${id_layanan_opd}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const result = await response.json();
    
    if (result.success && result.data && result.data.length > 0) {
      surveyList.value = result.data.map(survey => ({
        ...survey,
        // Nilai IKM acak antara 2.50 dan 4.00
        nilai_ikm: (Math.random() * (4.0 - 2.5) + 2.5).toFixed(2) 
      }));

      pageTitle.value = `Survei untuk "${result.data[0].layanan_opd}"`;
    } else {
      pageTitle.value = "Belum Ada Survei Tersedia";
    }
  } catch (error) {
    console.error("Gagal mengambil data survei:", error);
    pageTitle.value = "Gagal Memuat Data Survei";
  }

  const navItems = document.querySelectorAll(".nav-item");
  const mobileNavItems = document.querySelectorAll(".mobile-nav-item");
  navItems.forEach(item => item.addEventListener("click", (e) => handleNavClick(e)));
  mobileNavItems.forEach(item => item.addEventListener("click", (e) => handleNavClick(e, true)));
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
          <div class="flex justify-center mt-4">
            <div class="relative w-full max-w-sm">
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
                <p class="inline-block text-xs font-semibold text-teal-800 rounded-full px-3 py-1 my-2" style="background-color: rgba(0,200,201,0.32);">
                    Periode: {{ survey.periode }}
                </p>
            </div>

            <div class="relative w-24 h-24 sm:w-28 sm:h-28 my-2">
                <svg class="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" class="stroke-current text-gray-200" stroke-width="10" fill="transparent"></circle>
                    <circle cx="50" cy="50" r="45" class="progress-circle stroke-current text-[#00c8c9]" stroke-width="10" fill="transparent"
                            stroke-linecap="round"
                            transform="rotate(-90 50 50)"
                            :style="{ 'stroke-dashoffset': `calc(283 - (283 * ${survey.nilai_ikm || 0}) / 4)` }">
                    </circle>
                    <text x="50" y="52" text-anchor="middle" dominant-baseline="middle" class="text-2xl font-bold fill-current text-[#007c7e]">
                        {{ survey.nilai_ikm || 'N/A' }}
                    </text>
                </svg>
            </div>

            <router-link :to="'/data-responden/' + survey.id" class="button-detail bg-white text-[#00c8c9] px-5 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold border-2 border-[#00C9CA]">
                Isi Survei
            </router-link>
        </div>
    </div>

    </div>
    <div v-else class="text-center text-gray-500">
            <p>Tidak ada survei yang ditemukan atau tersedia untuk layanan ini.</p>
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
                            <span class="relative z-10">Portal Admin</span>
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
                            <button type="submit" class="w-full bg-white/90 text-[#007576] font-bold py-2 px-4 rounded-md hover:bg-white transition-colors">Kirim</button>
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

<style>
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

    /* [FINAL] SVG dengan warna baru yang disamakan dengan warna header */
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 220'%3e%3cpath fill='%23E2FEFE' d='M 400,220 H 200 V 110 C 270,90 330,170 400,130 Z'/%3e%3cpath fill='%23BFFDFD' d='M 400,220 H 200 V 120 C 280,100 320,180 400,140 Z'/%3e%3cpath fill='%23E2FEFE' d='M 200,110 C 130,130 70,70 0,90 V 220 H 200 Z'/%3e%3cpath fill='%23BFFDFD' d='M 200,120 C 120,140 80,80 0,100 V 220 H 200 Z'/%3e%3c/svg%3e");    
    background-repeat: no-repeat;
    background-size: 200% auto;
    background-position: 100% 100%;
    
    transition: background-position 0.8s cubic-bezier(0.25, 1, 0.5, 1),
                transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .card-oceanic-texture:hover {
    background-position: 0% 100%;
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