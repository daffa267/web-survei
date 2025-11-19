<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const siteInfo = ref({
  logo: '/images/Logo-Pemko.png',
  name: '...',
  nama_aplikasi: 'Memuat...',
});

const route = useRoute();
const router = useRouter();

const opdName = ref('Memuat...');
const serviceName = ref('');
const surveyId = ref(null);
const answerId = ref(null);

const kritikSaran = ref('');

onMounted(async () => {
  window.scrollTo(0, 0);
  opdName.value = route.query.opd_name || 'Dinas Tidak Ditemukan';
  serviceName.value = route.query.service_name || '';
  surveyId.value = route.query.survey_id;
  answerId.value = route.query.id_jawaban;

  try {
    const response = await fetch('https://admin.skm.tanjungpinangkota.go.id/api/site-setting');
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        siteInfo.value = {
          logo: result.data.file_logo,
          name: result.data.name.toUpperCase(),
          nama_aplikasi: result.data.nama_aplikasi,
        };
      }
    }
  } catch (error) {
    console.error("Gagal mengambil data pengaturan situs:", error);
  }
});

const handleKirim = async () => {
  const finalQuery = { opd_name: opdName.value, service_name: serviceName.value };

  // Fungsi untuk membersihkan session storage
  const cleanupSession = () => {
    sessionStorage.removeItem('respondentData');
    const surveyAnswersKey = `surveyAnswers-${surveyId.value}`;
    sessionStorage.removeItem(surveyAnswersKey);
  };

  // Jika tidak ada kritik, langsung ke halaman finish
  if (!kritikSaran.value.trim()) {
    cleanupSession();
    router.push({ path: '/finish', query: finalQuery });
    return;
  }

  // Jika ada kritik, coba kirim
  try {
    if (!answerId.value) {
      console.error("Error: ID Jawaban tidak ditemukan untuk mengirim kritik.");
    } else {
      const payload = {
        id_jawaban: answerId.value,
        kritik: kritikSaran.value,
        saran: ''
      };
      await axios.post('https://admin.skm.tanjungpinangkota.go.id/api/survey/kirim-kritik-saran', payload);
    }
  } catch (error) {
    console.error("Gagal mengirim kritik dan saran:", error);
    // --- PERBAIKAN: Alert dihapus, hanya log di console ---
    // alert("Gagal mengirim kritik dan saran, namun survei Anda sudah tercatat.");
  } finally {
    // Apapun hasilnya (sukses atau gagal), bersihkan data dan lanjut
    cleanupSession();
    router.push({ path: '/finish', query: finalQuery });
  }
};
</script>

<template>
  <div class="content-wrapper">
    <header class="header-solid w-full pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8 py-1 sm:py-2 fixed top-0 left-0 z-50">
      <div class="flex flex-row justify-between items-center w-full max-w-[1280px] mx-auto">
        <router-link to="/" class="flex flex-row items-center gap-3 sm:gap-1 h-20">
          <img :src="siteInfo.logo" class="h-[85px] w-auto" alt="Logo Pemko" />
          <div class="flex flex-col">
            <span class="text-[21px] sm:text-[24px] font-semibold leading-tight custom-gradient-text">{{ siteInfo.nama_aplikasi }}</span>
            <span class="text-[16px] font-semibold leading-tight custom-gradient-text">Pemko Tanjungpinang</span>
          </div>
        </router-link>
      </div>
    </header>

    <main class="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-20">
      <section class="w-full text-center py-4">
        <h1 class="text-lg font-semibold text-[#04b0b1] mt-1">Survei Kepuasan Masyarakat</h1>
        <h2 class="text-[28px] sm:text-[32px] font-semibold text-[#04b0b1] leading-tight">{{ opdName }}</h2>
        <p v-if="serviceName" class="text-lg sm:text-xl text-[#04b0b1] font-semibold -mt-1">
          {{ serviceName }}
        </p>
      </section>

      <div class="w-full flex items-start justify-center px-2 sm:px-12 my-8">
        <div class="flex flex-col items-center text-center step-item completed"><div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl"><i class="fa-solid fa-user"></i></div><p class="mt-2 text-sm sm:text-base font-semibold">Responden</p></div>
        <div class="step-line completed relative top-[28px] sm:top-[36px]"></div>
        <div class="flex flex-col items-center text-center step-item completed"><div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl"><i class="fa-solid fa-clipboard-list"></i></div><p class="mt-2 text-sm sm:text-base font-semibold">Survey</p></div>
        <div class="step-line completed relative top-[28px] sm:top-[36px]"></div>
        <div class="flex flex-col items-center text-center step-item active"><div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl"><i class="fa-solid fa-comment-dots"></i></div><p class="mt-2 text-sm sm:text-base font-semibold">Kritik & Saran</p></div>
        <div class="step-line relative top-[28px] sm:top-[36px]"></div>
        <div class="flex flex-col items-center text-center step-item"><div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl"><i class="fa-solid fa-check"></i></div><p class="mt-2 text-sm sm:text-base font-semibold">Selesai</p></div>
      </div>
      <section class="form-card-gradient w-full px-6 sm:px-12 py-8 sm:py-10 rounded-2xl shadow-[-4px_4px_10px_0px_rgba(0,0,0,0.17)] flex flex-col mt-4 min-h-[450px]">
        <div class="text-center mb-6"><h3 class="text-2xl font-bold text-[#009293]">"Kritik & Saran"</h3></div>
        <div class="flex-grow flex flex-col">
          <textarea v-model="kritikSaran" placeholder="Masukkan kritik dan saran anda... (Opsional)" class="kritik-saran-textarea w-full flex-grow px-4 py-3 bg-[#E4FDFB] border border-[#b3e0e0] rounded-[12px] shadow-sm text-[#016465] focus:outline-none focus:ring-[#00c8c9] focus:border-[#00c8c9] resize-none"></textarea>
        </div>
        <div class="flex flex-col-reverse sm:flex-row sm:justify-between items-center pt-8 mt-auto gap-4 sm:gap-0">
            <router-link :to="{ path: `/survei/${surveyId}`, query: { opd_name: opdName, service_name: serviceName } }" class="w-full sm:w-auto text-center px-8 py-2 border border-[#009293] rounded-[12px] text-[#009293] font-semibold hover:bg-cyan-50 transition-colors">&larr; Sebelumnya</router-link>
            <button @click="handleKirim" class="w-full sm:w-auto text-center px-8 py-2 bg-[#00c8c9] text-white font-semibold rounded-[12px] hover:bg-[#00a6a7] transition-colors">Kirim &rarr;</button>
        </div>
        </section>
    </main>
  </div>
  <footer class="w-full relative h-48"><img src="/images/footer-cut.svg" class="w-[150vw] h-[150%] sm:h-auto sm:w-auto sm:min-w-[102vw] absolute bottom-0 -right-0 sm:-right-10 -z-10 object-cover" alt="Footer Background" /></footer>
</template>
<style>
.content-wrapper > header.header-solid,
.content-wrapper > header.header-solid.scrolled {
  background-color: #fff !important;
  background-image: none !important;
}

@media screen and (max-width: 1023px) {
  .content-wrapper > header.header-solid {
    background-color: #fff !important;
    background-image: none !important;
  }
}

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

.step-item.active .step-icon,
.step-item.completed .step-icon {
  background: linear-gradient(135deg, #22d3ee 0, #26ebd2 50%, #06b6d4 100%);
  color: #fff;
}

.step-item.active .step-icon {
  border: none;
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

.form-card-gradient {
  background: linear-gradient(225deg, #49f7f7 0, #fff 80%);
}

.kritik-saran-textarea::placeholder {
  color: #7dc3c3 !important;
  font-style: italic;
  opacity: 1;
}
</style>