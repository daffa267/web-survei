<script setup>
import { onMounted } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Impor file CSS untuk AOS

onMounted(() => {
  // Inisialisasi AOS dengan durasi animasi 800ms
  AOS.init({
    duration: 800,
    once: true, // Animasi hanya berjalan sekali
  });

  // Efek scroll pada header (sama seperti sebelumnya)
  const handleScroll = () => {
    const header = document.querySelector("header");
    if (header && window.scrollY > 10) {
      header.classList.add("scrolled");
    } else if (header) {
      header.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
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

    <main class="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-20">
      <section class="w-full text-center py-4">
        <h1 class="text-lg font-semibold text-[#04b0b1] mt-1">
          Survei Kepuasan Masyarakat
        </h1>
        <h2 class="text-[28px] sm:text-[32px] font-semibold text-[#04b0b1] leading-tight">
          Dinas Komunikasi dan Informatika
        </h2>
      </section>

      <div class="w-full flex items-start justify-center px-2 sm:px-12 my-8">
        <div class="flex flex-col items-center text-center step-item completed">
          <div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl">
            <i class="fa-solid fa-user"></i>
          </div>
          <p class="mt-2 text-sm sm:text-base font-semibold">Responden</p>
        </div>
        <div class="step-line completed relative top-[28px] sm:top-[36px]"></div>
        <div class="flex flex-col items-center text-center step-item completed">
          <div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl">
            <i class="fa-solid fa-clipboard-list"></i>
          </div>
          <p class="mt-2 text-sm sm:text-base font-semibold">Survey</p>
        </div>
        <div class="step-line completed relative top-[28px] sm:top-[36px]"></div>
        <div class="flex flex-col items-center text-center step-item completed">
          <div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl">
            <i class="fa-solid fa-comment-dots"></i>
          </div>
          <p class="mt-2 text-sm sm:text-base font-semibold">Kritik & Saran</p>
        </div>
        <div class="step-line completed relative top-[28px] sm:top-[36px]"></div>
        <div class="flex flex-col items-center text-center step-item active">
          <div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl">
            <i class="fa-solid fa-check"></i>
          </div>
          <p class="mt-2 text-sm sm:text-base font-semibold">Selesai</p>
        </div>
      </div>

      <section class="w-full flex justify-center items-center mt-4 min-h-[350px]">
        <div
          data-aos="zoom-in"
          data-aos-easing="ease-out-back"
          class="relative w-full max-w-md bg-[#00c8c9] text-white p-6 sm:p-8 rounded-2xl shadow-lg text-center flex flex-col items-center"
        >
          <router-link to="/" class="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
            <i class="fa-solid fa-house text-[#00c8c9]"></i>
          </router-link>
          
          <h3 class="text-xl sm:text-2xl font-bold mb-4">
            Survei Berhasil Terkirim!
          </h3>
          
          <div class="my-4">
            <img src="/images/img_recommendation_1.png" alt="Recommendation" class="h-28 sm:h-32 w-auto">
          </div>

          <p class="mt-4 text-sm sm:text-base">
            Terima kasih telah mengisi survei kami. Masukan Anda sangat berarti untuk kemajuan layanan kami.
          </p>
        </div>
      </section>
    </main>
  </div>

  <footer class="w-full relative h-48">
    <img src="/images/footer-cut.svg" class="w-full min-w-[108vw] h-auto absolute bottom-0 left-[103%] -translate-x-1/2 -z-10 mt-12" alt="Footer Background" />
  </footer>
</template>

<style>
/* Style tidak ada perubahan dari sebelumnya */
body {
  font-family: "Archivo", sans-serif;
  background-color: #f2fffc;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content-wrapper {
  flex: 1 0 auto;
}
footer {
  flex-shrink: 0;
}
.custom-gradient-text {
  background: linear-gradient(to right, #007c7e, #00b9b9);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
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

.step-item {
  color: #aaeeed;
  width: 80px;
}
.step-item.active {
  color: #00c8c9;
}
.step-item.completed {
    color: #009293;
}
.step-icon {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #aaeeed;
  color: #ececec;
}
.step-item.active .step-icon {
  background: linear-gradient(135deg, #22d3ee 0%, #26ebd2 50%, #06b6d4 100%);
  border: none;
  color: white;
}
.step-item.completed .step-icon {
    background: linear-gradient(135deg, #22d3ee 0%, #26ebd2 50%, #06b6d4 100%);
    color: white;
}
.step-line {
  flex-grow: 1;
  height: 3.2px;
  background-color: #aaeeed;
  margin: 0 0.25rem;
}
.step-line.completed {
    background-color: #26ebd2;
}
</style>