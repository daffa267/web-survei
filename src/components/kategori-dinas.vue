<script setup>
import { onMounted, ref } from 'vue';

// Data dinamis untuk setiap kategori dinas
const dinas = ref([
  { name: 'DINAS KEPEMUDAAN, OLAHRAGA DAN PARIWISATA', rating: '98.10' },
  { name: 'DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL', rating: '95.50' },
  { name: 'DINAS KESEHATAN', rating: '92.75' },
  { name: 'DINAS KOMUNIKASI DAN INFORMATIKA', rating: '99.20' },
  { name: 'DINAS KEPEMUDAAN , OLAHRAGA DAN PARIWISATA', rating: '98.10' },
  { name: 'DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL', rating: '95.50' },
  { name: 'DINAS KESEHATAN', rating: '92.75' },
  { name: 'DINAS KOMUNIKASI DAN INFORMATIKA', rating: '99.20' }
]);

onMounted(() => {
  // --- Efek Scroll pada Header ---
  const handleScroll = () => {
    const header = document.querySelector("header");
    if (header && window.scrollY > 10) {
      header.classList.add("scrolled");
    } else if (header) {
      header.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll);

  // --- Logika untuk Navigasi Interaktif ---
  let isClickScrolling = false;
  let scrollTimeout = null;
  const navItems = document.querySelectorAll(".nav-item");
  const indicator = document.getElementById("nav-indicator");
  const sections = document.querySelectorAll("section[id]");

  const updateNavIndicator = (activeItem) => {
    if (!activeItem || !indicator) return;

    navItems.forEach((item) => {
      item.classList.remove("text-[#01c4c6]");
      item.classList.add("text-white");
    });
    activeItem.classList.remove("text-white");
    activeItem.classList.add("text-[#01c4c6]");

    indicator.style.width = `${activeItem.offsetWidth}px`;
    indicator.style.transform = `translateX(${activeItem.offsetLeft}px) translateY(calc(-50%))`;
  };

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const navName = this.getAttribute("data-nav");
      if (!navName) return;

      isClickScrolling = true;
      clearTimeout(scrollTimeout);
      updateNavIndicator(this);

      window.location.href = `/${navName === 'beranda' ? '' : '#' + navName}`;

      scrollTimeout = setTimeout(() => {
        isClickScrolling = false;
      }, 800);
    });
  });
  
  handleScroll();
});

// --- Fungsi untuk Toggle Menu Mobile ---
const toggleMobileMenu = () => {
  const menu = document.getElementById("mobileMenu");
  if (menu) {
    menu.classList.toggle("hidden");
  }
};
</script>

<template>
  <div class="content-wrapper">
    <header class="w-full pl-1 pr-4 sm:pl-2 sm:pr-6 lg:pl-4 lg:pr-8 py-1 sm:py-2 fixed top-0 left-0 z-50">
      <div class="flex flex-row justify-between items-center w-full max-w-[1280px] mx-auto">
        <router-link to="/" class="flex flex-row items-center gap-3 sm:gap-1">
          <img src="/images/logo esurvey.png" class="h-[80px] w-auto" alt="Logo Pemkot" />
          <div class="flex flex-col">
            <span class="text-[24px] font-semibold leading-tight custom-gradient-text">E-Survei</span>
            <span class="text-[16px] font-semibold leading-tight custom-gradient-text">Pemkot Tanjungpinang</span>
          </div>
        </router-link>
      </div>
    </header>

    <main class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-28">
        <div class="text-center mb-12 relative">
          <h1 class="text-[28px] sm:text-[32px] lg:text-[40px] font-semibold text-[#04b0b1] leading-tight mb-6">
            Kategori Dinas
          </h1>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 lg:gap-y-10 lg:gap-x-20 mb-16 max-w-7xl mx-auto justify-items-center">
            
            <div v-for="(item, index) in dinas" :key="index" class="relative overflow-visible rounded-xl custom-shadow h-[188px] w-[170px] sm:h-[200px] sm:w-[200px] lg:h-[259px] lg:w-[259px]">
              <div class="absolute inset-0 bg-[#00c8c9] border-2 border-[#00c8c9] rounded-xl z-0"></div>
              <img src="/images/card-unsur.svg" class="absolute top-[30.4%] sm:top-[23%] left-1/2 transform -translate-x-[25.05%] h-auto z-10" style="width: 102.262% !important; max-width: 102.3% !important" alt="Card Decoration" />
              <div class="relative z-20 w-full h-full p-4 flex flex-col items-center justify-center text-center">
                
                <h3 class="text-white font-semibold text-[11px] sm:text-xs mb-1 sm:mb-2 leading-tight min-h-[34px] flex items-center justify-center">{{ item.name }}</h3>
                
                <div class="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] lg:w-[100px] lg:h-[100px] mb-2 sm:mb-3 rounded-full flex items-center justify-center card-image border-2 border-white/80 bg-[#00B0B1]">
                  <span class="text-white font-bold text-lg sm:text-xl lg:text-2xl tracking-tight">{{ item.rating }}</span>
                </div>
                
                <router-link to="/data-responden" class="button-detail bg-white text-[#00c8c9] px-5 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold border-2 border-[#00C9CA]">Mulai Survei</router-link>
              </div>
            </div>

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
            <p class="mb-2">(031) 12345678</p>
            <p>kominfo@tanjungpinangkota.go.id</p>
          </div>
        </div>
        <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="md:ml-12">
            <h3 class="text-white font-semibold text-2xl mb-4">E-Survei</h3>
            <div class="text-white/90 text-sm leading-relaxed space-y-2">
              <p><a href="/" class="hover:text-white transition-colors">Home</a></p>
              <p><a href="/#tentang" class="hover:text-white transition-colors">Tentang</a></p>
              <p><a href="/#unsur" class="hover:text-white transition-colors">Unsur Survei</a></p>
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
          Copyright Kerja Praktek UMRAH 2025
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
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0) 100%
  ) !important;
  backdrop-filter: blur(0px);
  transition: all 0.3s ease-in-out;
}
header.scrolled {
  background: linear-gradient(
    90deg,
    #f2fffc 25%,
    rgba(57, 211, 211, 0.748) 100%
  ) !important;
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
footer {
  flex-shrink: 0;
}
#nav-indicator {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.button-detail {
  transition: background-color 0.3s ease, color 0.3s ease;
}
.button-detail:hover {
  background-color: #00c8c9;
  color: white;
}
</style>