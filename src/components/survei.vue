<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const isLoading = ref(true);
const siteInfo = ref({
  logo: '/images/Logo-Pemko.png',
  name: '...',
  nama_aplikasi: 'Memuat...',
});
const isModalVisible = ref(false);
const route = useRoute();
const router = useRouter();
const opdName = ref('Memuat...');
const serviceName = ref('');
const surveyData = ref({ indicators: [] });
const initialLoadComplete = ref(false);
const showValidationModal = ref(false);
const validationMessage = ref('');
const surveyAnswersKey = computed(() => `surveyAnswers-${route.params.id}`);

onMounted(async () => {
  window.scrollTo(0, 0);
  opdName.value = route.query.opd_name || 'Nama OPD Tidak Ditemukan';
  serviceName.value = route.query.service_name || '';

  try {
    const response = await fetch('https://admin.skm.tanjungpinangkota.go.id/api/site-setting');
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        const data = result.data;
        await new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = () => { resolve(); };
            img.src = data.file_logo;
        });
        siteInfo.value = { 
          logo: data.file_logo, 
          name: data.name.toUpperCase(),
          nama_aplikasi: data.nama_aplikasi,
        };
      }
    }

    const idSurvey = route.params.id;
    if (!idSurvey) { 
      opdName.value = "Error: ID Survei tidak valid"; 
      isLoading.value = false;
      return; 
    }

    const surveyResp = await fetch(`https://admin.skm.tanjungpinangkota.go.id/api/survey/pertanyaan?id_survey=${idSurvey}`);
    if (surveyResp.ok) {
      const result = await surveyResp.json();
      if (result.success && result.data.length > 0 && result.data[0].pertanyaan.length > 0) {
        const data = result.data[0];
        const groupedQuestions = {};
        const savedAnswers = JSON.parse(sessionStorage.getItem(surveyAnswersKey.value)) || {};
        data.pertanyaan.forEach(q => {
          const indicatorName = q.indikator.name;
          if (!groupedQuestions[indicatorName]) { groupedQuestions[indicatorName] = []; }
          const sortedOptions = q.pilihan_jawaban.sort((a, b) => a.bobot - b.bobot);
          groupedQuestions[indicatorName].push({ 
            id: q.id, 
            text: q.name, 
            rating: savedAnswers[q.id] || 0, 
            options: sortedOptions
          });
        });
        surveyData.value.indicators = Object.keys(groupedQuestions).map(name => ({ name: name, questions: groupedQuestions[name] }));
      } else {
        surveyData.value.indicators = [];
      }
    } else {
        surveyData.value.indicators = [];
    }
  } catch (error) { 
    console.error("Gagal memuat data halaman:", error); 
    opdName.value = "Terjadi Kesalahan"; 
  } finally {
    isLoading.value = false;
    setTimeout(() => {
        initialLoadComplete.value = true;
    }, 100);
  }
});

watch(surveyData, (newData) => {
  if (!initialLoadComplete.value) return;
  const answersToSave = {};
  if(newData && newData.indicators) {
    newData.indicators.forEach(indicator => {
      indicator.questions.forEach(question => {
        if (question.rating > 0) {
          answersToSave[question.id] = question.rating;
        }
      });
    });
  }
  sessionStorage.setItem(surveyAnswersKey.value, JSON.stringify(answersToSave));
}, { deep: true });

const handleNext = async () => {
  const storedData = sessionStorage.getItem('respondentData');
  if (!storedData) {
    validationMessage.value = 'Data responden tidak ditemukan. Harap kembali dan isi data responden.';
    showValidationModal.value = true;
    return;
  }
  
  const respondentData = JSON.parse(storedData);
  const jawaban = [];
  let allAnswered = true;
  surveyData.value.indicators.forEach(indicator => {
    indicator.questions.forEach(question => {
      if (question.rating === 0) allAnswered = false;
      const pilihanJawaban = question.options.find(opt => opt.bobot === question.rating);
      jawaban.push({
        id_pertanyaan: question.id,
        id_pilihan_jawaban: pilihanJawaban ? pilihanJawaban.id : null,
      });
    });
  });

  if (!allAnswered) {
    validationMessage.value = 'Harap isi semua pertanyaan survei sebelum melanjutkan.';
    showValidationModal.value = true;
    return;
  }

  const finalPayload = {
    ...respondentData,
    id_survey: parseInt(route.params.id),
    jawaban: jawaban,
  };

  try {
    const response = await axios.post('https://admin.skm.tanjungpinangkota.go.id/api/survey/kirim-jawaban', finalPayload);
    if (response.data.success) {
      const idJawaban = response.data.data.id;
      
      // --- PERBAIKAN: Baris di bawah ini dihapus agar data tidak ter-reset ---
      // sessionStorage.removeItem('respondentData');
      // sessionStorage.removeItem(surveyAnswersKey.value);
      
      router.push({ 
        path: '/kritik-saran', 
        query: { 
          id_jawaban: idJawaban, 
          opd_name: opdName.value,
          service_name: serviceName.value,
          survey_id: route.params.id
        } 
      });
    } else {
      validationMessage.value = 'Gagal mengirimkan jawaban. Silakan coba lagi.';
      showValidationModal.value = true;
    }
  } catch (error) {
    validationMessage.value = 'Terjadi kesalahan saat mengirim survei. Periksa koneksi Anda.';
    showValidationModal.value = true;
  }
};

const getLabelText = (question) => {
  if (!question || question.rating === 0) return '';
  const selectedOption = question.options.find(opt => opt.bobot === question.rating);
  return selectedOption ? selectedOption.name : '';
};

const getLabelClass = (rating) => {
  if (rating > 4) return 'bg-green-400 text-green-900';
  if (rating === 4) return 'bg-green-200 text-green-900';
  if (rating === 3) return 'bg-blue-200 text-blue-900';
  if (rating === 2) return 'bg-yellow-200 text-yellow-900';
  if (rating === 1) return 'bg-red-200 text-red-900';
  return 'bg-gray-200 text-gray-900';
};
</script>

<template>
  <Transition name="loader-fade"><div v-if="isLoading" class="loading-overlay"><div class="spinner-container"></div></div></Transition>
  <div class="content-wrapper">
    <header class="header-solid w-full pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8 py-1 sm:py-2 fixed top-0 left-0 z-50">
      <div class="flex flex-row justify-between items-center w-full max-w-[1280px] mx-auto">
        <router-link to="/" class="flex flex-row items-center gap-0 sm:gap-1 h-20 -ml-0.5 sm:ml-0">
          <img :src="siteInfo.logo" class="h-[85px] w-auto" alt="Logo Pemko" />
          <div class="flex flex-col">
            <span class="text-[20.5px] sm:text-[24px] font-semibold leading-tight custom-gradient-text">{{ siteInfo.nama_aplikasi }}</span>
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
        <div class="flex flex-col items-center text-center step-item active"><div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl"><i class="fa-solid fa-clipboard-list"></i></div><p class="mt-2 text-sm sm:text-base font-semibold">Survey</p></div>
        <div class="step-line relative top-[28px] sm:top-[36px]"></div>
        <div class="flex flex-col items-center text-center step-item"><div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl"><i class="fa-solid fa-comment-dots"></i></div><p class="mt-2 text-sm sm:text-base font-semibold">Kritik & Saran</p></div>
        <div class="step-line relative top-[28px] sm:top-[36px]"></div>
        <div class="flex flex-col items-center text-center step-item"><div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl"><i class="fa-solid fa-check"></i></div><p class="mt-2 text-sm sm:text-base font-semibold">Selesai</p></div>
      </div>

      <section class="form-card-gradient w-full px-6 sm:px-12 py-8 sm:py-10 rounded-2xl shadow-[-4px_4px_10px_0px_rgba(0,0,0,0.17)] flex flex-col mt-4 relative">
        <div class="absolute top-3 right-3 group z-20"><div @click="isModalVisible = true" class="w-6 h-6 flex items-center justify-center rounded-full bg-[#209FA0] text-white cursor-pointer shadow-md hover:opacity-90 transition-opacity"><i class="fa-solid fa-info text-white text-sm"></i></div><div class="absolute right-0 top-full mt-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Petunjuk Survei<div class="absolute -top-1 right-2 w-2 h-2 bg-gray-800 rotate-45"></div></div></div>
        <div v-if="!isLoading && surveyData.indicators.length > 0">
          <div v-for="(indicator, index) in surveyData.indicators" :key="indicator.name" :class="{'mt-10 pt-10 border-t-2 border-cyan-100' : index > 0}">
            <div class="mb-8"><h3 class="text-2xl font-bold text-[#009293] text-center">{{ indicator.name }}</h3></div>
            <div class="space-y-6">
                <div v-for="(item, qIndex) in indicator.questions" :key="item.id" class="flex flex-col">
                    <p class="text-base text-[#016465] mb-3">{{ qIndex + 1 }}. {{ item.text }}</p>
                    <div class="flex flex-row items-center gap-3">
                        <div class="flex items-center space-x-1 sm:space-x-2"><i v-for="option in item.options" :key="option.id" @click="item.rating = option.bobot" :class="['fa-solid fa-star text-2xl cursor-pointer transition-transform duration-150 ease-in-out hover:scale-125', option.bobot <= item.rating ? 'text-yellow-400' : 'text-gray-300']"></i></div>
                        <span v-if="item.rating > 0" :class="['px-2 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm font-semibold rounded-full', getLabelClass(item.rating)]">{{ getLabelText(item) }}</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
        <div v-else-if="!isLoading && surveyData.indicators.length === 0" class="text-center py-10"><p class="text-lg text-gray-600 font-semibold">Pertanyaan untuk survei ini belum tersedia.</p><p class="text-gray-500 mt-2">Silakan coba lagi nanti atau hubungi administrator.</p></div>
        <div class="flex flex-col-reverse sm:flex-row sm:justify-between items-center pt-8 mt-10 border-t-2 border-cyan-100 gap-4 sm:gap-0">
            <router-link :to="{ path: `/data-responden/${route.params.id}`, query: { opd_name: opdName, service_name: serviceName, from: 'survey' } }" class="w-full sm:w-auto text-center px-8 py-2 border border-[#009293] rounded-[12px] text-[#009293] font-semibold hover:bg-cyan-50 transition-colors">&larr; Sebelumnya</router-link>
            <button @click="handleNext" :disabled="surveyData.indicators.length === 0" class="w-full sm:w-auto text-center px-8 py-2 bg-[#00c8c9] text-white font-semibold rounded-[12px] hover:bg-[#00a6a7] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">Selanjutnya &rarr;</button>
        </div>
      </section>
    </main>
    <div v-if="isModalVisible" class="modal-overlay"><div class="modal-content"><button @click="isModalVisible = false" class="modal-close-button">&times;</button><h3 class="text-2xl font-bold text-center mb-6">Petunjuk Penilaian Survei</h3><div class="space-y-3 text-lg"><p>Anda dapat memberikan penilaian dengan memilih bintang sesuai dengan tingkat kepuasan Anda terhadap setiap pertanyaan yang diberikan.</p></div></div></div>
    <div v-if="showValidationModal" class="modal-overlay"><div class="modal-content"><h3 class="text-xl font-bold text-center mb-4 text-yellow-500">Peringatan</h3><p class="text-center text-white/90 mb-6">{{ validationMessage }}</p><button @click="showValidationModal = false" class="w-full bg-white/90 text-[#007576] font-bold py-2 px-4 rounded-md hover:bg-white transition-colors">Mengerti</button></div></div>
  </div>
  <footer class="w-full relative h-72"><img src="/images/Group Footer.svg" class="w-[150vw] h-[120%] sm:h-auto sm:w-auto sm:min-w-[108vw] absolute bottom-0 -right-0 sm:-right-10 -z-10 object-cover" alt="Footer Background" /></footer>
</template>
<style>
/* STYLE TIDAK BERUBAH */
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
  font-family: Archivo, sans-serif;
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
  background: linear-gradient(135deg, #22d3ee 0, #26ebd2 50%, #06b6d4 100%);
  border: none;
  color: #fff;
}

.step-item.completed .step-icon {
  background: linear-gradient(135deg, #22d3ee 0, #26ebd2 50%, #06b6d4 100%);
  color: #fff;
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

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  padding: 1rem;
}

.modal-content {
  background-color: #00c8c9;
  color: #fff;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  max-width: 24rem;
  width: 100%;
  position: relative;
}

.modal-close-button {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 2rem;
  height: 2rem;
  background-color: #fff;
  color: #00c8c9;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1;
  transition: background-color 0.2s;
}

.modal-close-button:hover {
  background-color: #e2e8f0;
}
</style>