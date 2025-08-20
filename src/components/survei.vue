<script setup>
import { onMounted, ref } from 'vue';

// Efek scroll pada header (sama seperti sebelumnya)
onMounted(() => {
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

// Data untuk pertanyaan survei, dibuat reaktif dengan ref()
const surveyQuestions = ref([
  {
    id: 1,
    text: "Apakah persyaratan layanan yang diminta sudah jelas dan mudah dipahami?",
    rating: 5,
    label: "Sangat Baik"
  },
  {
    id: 2,
    text: "Apakah jumlah dokumen/syarat yang diminta tidak berlebihan?",
    rating: 4,
    label: "Baik"
  },
  {
    id: 3,
    text: "Apakah informasi mengenai persyaratan layanan mudah diakses?",
    rating: 4,
    label: "Baik"
  },
  {
    id: 4,
    text: "Apakah petugas membantu menjelaskan persyaratan jika ada yang kurang jelas?",
    rating: 2,
    label: "Buruk"
  },
  {
    id: 5,
    text: "Apakah persyaratan layanan mudah untuk dipenuhi oleh masyarakat?",
    rating: 1,
    label: "Sangat Buruk"
  }
]);

// Fungsi untuk menentukan warna label berdasarkan rating
const getLabelClass = (rating) => {
  if (rating >= 4) return 'bg-green-100 text-green-800';
  if (rating === 3) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
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

    <main class="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-20">
      <section class="w-full text-center py-4">
        <h1 class="text-lg font-semibold text-[#04b0b1] mt-1">
          Survei Kepuasan Masyarakat
        </h1>
        <h2 class="text-[28px] sm:text-[32px] font-semibold text-[#04b0b1] leading-tight">
          Dinas Komunikasi dan Informatika
        </h2>
      </section>

      <div class="w-full flex items-center justify-center px-4 sm:px-12 my-8">
        <div class="flex flex-col items-center text-center step-item completed">
          <div class="step-icon">
            <i class="fa-solid fa-user"></i>
          </div>
          <p class="mt-2 text-base font-semibold">Responden</p>
        </div>
        <div class="step-line completed"></div>
        <div class="flex flex-col items-center text-center step-item active">
          <div class="step-icon">
            <i class="fa-solid fa-building"></i>
          </div>
          <p class="mt-2 text-base font-semibold">Survey</p>
        </div>
        <div class="step-line"></div>
        <div class="flex flex-col items-center text-center step-item">
          <div class="step-icon">
            <i class="fa-solid fa-comments"></i>
          </div>
          <p class="mt-2 text-base font-semibold">Kritik & Saran</p>
        </div>
        <div class="step-line"></div>
        <div class="flex flex-col items-center text-center step-item">
          <div class="step-icon">
            <i class="fa-solid fa-check"></i>
          </div>
          <p class="mt-2 text-base font-semibold">Selesai</p>
        </div>
      </div>

      <section class="form-card-gradient w-full px-8 sm:px-12 py-8 sm:py-10 rounded-2xl shadow-[-4px_4px_10px_0px_rgba(0,0,0,0.17)] flex flex-col mt-4">
        <div class="flex justify-between items-center mb-8">
            <h3 class="text-2xl font-bold text-[#009293]">
                "Persyaratan"
            </h3>
            <i class="fa-solid fa-info-circle text-2xl text-gray-400 cursor-pointer" title="Informasi"></i>
        </div>

        <div class="space-y-8 flex-grow flex flex-col">
            <div v-for="item in surveyQuestions" :key="item.id" class="flex flex-col">
                <p class="text-base text-[#016465] mb-3">{{ item.id }}. {{ item.text }}</p>
                <div class="flex items-center gap-4">
                    <div class="flex items-center space-x-2">
                        <i v-for="n in 5" :key="n" 
                           :class="['fa-solid fa-star text-2xl cursor-pointer', n <= item.rating ? 'text-yellow-400' : 'text-gray-300']">
                        </i>
                    </div>
                    <span :class="['px-3 py-1 text-sm font-semibold rounded-full', getLabelClass(item.rating)]">
                        {{ item.label }}
                    </span>
                </div>
            </div>

            <div class="flex justify-between items-center pt-8 mt-auto">
                <button type="button" class="px-8 py-2 border border-[#009293] rounded-[12px] text-[#009293] font-semibold hover:bg-cyan-50 transition-colors">
                &larr; Sebelumnya
                </button>
                <button type="submit" class="px-8 py-2 bg-[#00c8c9] text-white font-semibold rounded-[12px] hover:bg-[#00a6a7] transition-colors">
                Selanjutnya &rarr;
                </button>
            </div>
        </div>
      </section>
    </main>
  </div>

  <footer class="w-full relative h-48">
    <img src="/images/Group Footer.svg" class="w-full min-w-[108vw] h-auto absolute bottom-0 left-[103%] -translate-x-1/2 -z-10 mt-12" alt="Footer Background" />
  </footer>
</template>

<style>
/* Global & Reusable Styles (SAMA PERSIS) */
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

/* Header Styles (SAMA PERSIS) */
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

/* Stepper Styles (DITAMBAH GAYA BARU UNTUK 'completed') */
.step-item {
  color: #aaeeed;
}
.step-item .step-icon {
  color: #ececec;
}
.step-item.active {
  color: #00c8c9;
}
.step-icon {
  border-radius: 50%;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background-color: #aaeeed;
}
.step-item.active .step-icon {
  background: linear-gradient(135deg, #22d3ee 0%, #26ebd2 50%, #06b6d4 100%);
  border: none;
  color: white;
}
.step-line {
  flex-grow: 1;
  height: 3.2px;
  background-color: #aaeeed;
  margin: 0 1rem;
  position: relative;
  top: -14px; /* Disesuaikan agar sejajar dengan tengah ikon */
}

/* Gaya baru untuk step yang sudah selesai */
.step-item.completed {
    color: #a0a0a0; /* Teks menjadi abu-abu */
}
.step-item.completed .step-icon {
    background: linear-gradient(135deg, #22d3ee 0%, #26ebd2 50%, #06b6d4 100%);
    color: white;
}
.step-line.completed {
    background-color: #26ebd2; /* Garis menjadi warna aktif */
}


.form-card-gradient {
  background: linear-gradient(225deg, #49F7F7 0%, #FFFFFF 80%);
}
</style>