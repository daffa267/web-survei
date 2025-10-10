<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const siteInfo = ref({
  logo: '/images/Logo-Pemko.png',
  name: '...',
});

const isModalVisible = ref(false);
const route = useRoute();
const router = useRouter();

const surveyData = ref({
  opdName: 'Memuat...',
  indicators: [],
});

onMounted(async () => {
  try {
    const response = await fetch('https://admin.skm.tanjungpinangkota.go.id/api/site-setting');
    if (!response.ok) throw new Error('Network response was not ok');
    const result = await response.json();
    if (result.success && result.data) { 
      siteInfo.value = { 
        logo: result.data.file_logo, 
        name: result.data.name.toUpperCase() 
      }; 
    }
  } catch (error) { console.error("Gagal mengambil data pengaturan situs:", error); }

  const idSurvey = route.params.id;
  if (!idSurvey) { 
    surveyData.value.opdName = "Error: ID Survei tidak valid"; 
    return; 
  }

  try {
    const surveyResp = await fetch(`https://admin.skm.tanjungpinangkota.go.id/api/survey/pertanyaan?id_survey=${idSurvey}`);
    if (!surveyResp.ok) throw new Error('Gagal mengambil data survei');
    const result = await surveyResp.json();
    if (result.success && result.data.length > 0) {
      const data = result.data[0];
      surveyData.value.opdName = data.get_layanan_opd?.get_opd?.name || 'Nama OPD';
      const groupedQuestions = {};
      data.pertanyaan.forEach(q => {
        const indicatorName = q.indikator.name;
        if (!groupedQuestions[indicatorName]) { groupedQuestions[indicatorName] = []; }
        groupedQuestions[indicatorName].push({ id: q.id, text: q.name, rating: 0, options: q.pilihan_jawaban });
      });
      surveyData.value.indicators = Object.keys(groupedQuestions).map(name => ({ name: name, questions: groupedQuestions[name] }));
    }
  } catch (error) { 
    console.error("Gagal memuat pertanyaan survei:", error); 
    surveyData.value.opdName = "Gagal Memuat Pertanyaan"; 
  }
});

const handleNext = async () => {
  const storedData = sessionStorage.getItem('respondentData');
  if (!storedData) {
    console.error('Data responden tidak ditemukan!');
    router.push(`/data-responden/${route.params.id}`);
    return;
  }
  const respondentData = JSON.parse(storedData);

  const jawaban = [];
  let allAnswered = true;
  surveyData.value.indicators.forEach(indicator => {
    indicator.questions.forEach(question => {
      if (question.rating === 0) {
        allAnswered = false;
      }
      jawaban.push({
        id_pertanyaan: question.id,
        id_pilihan_jawaban: question.options.find(opt => opt.bobot === question.rating)?.id,
      });
    });
  });

  if (!allAnswered) {
    alert('Harap isi semua pertanyaan survei sebelum melanjutkan.');
    return;
  }

  const finalPayload = {
    ...respondentData,
    id_survey: parseInt(route.params.id),
    jawaban: jawaban,
  };

  console.log('Mengirim payload final:', finalPayload);

  try {
    const response = await axios.post('https://admin.skm.tanjungpinangkota.go.id/api/survey/kirim-jawaban', finalPayload);

    if (response.data.success) {
      console.log('Survei berhasil dikirim!', response.data);
      const idJawaban = response.data.data.id;
      sessionStorage.removeItem('respondentData');
      router.push(`/kritik-saran?id_jawaban=${idJawaban}`);
    } else {
      console.error('API merespons tidak sukses:', response.data.message);
    }
  } catch (error) {
    console.error('Gagal mengirim survei:', error);
    if (error.response) {
      console.log('Detail error dari server:', error.response.data);
    }
  }
};

const getLabelText = (rating) => {
  switch (rating) {
    case 4: return 'Sangat Baik';
    case 3: return 'Baik';
    case 2: return 'Buruk';
    case 1: return 'Sangat Buruk';
    default: return '';
  }
};

const getLabelClass = (rating) => {
  switch (rating) {
    case 4: return 'bg-green-200 text-green-900';
    case 3: return 'bg-blue-200 text-blue-900';
    case 2: return 'bg-yellow-200 text-yellow-900';
    case 1: return 'bg-red-200 text-red-900';
    default: return 'bg-gray-200 text-gray-900';
  }
};
</script>

<template>
  <div class="content-wrapper">
    <header class="header-solid w-full pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8 py-1 sm:py-2 fixed top-0 left-0 z-50">
      <div class="flex flex-row justify-between items-center w-full max-w-[1280px] mx-auto">
        <router-link to="/" class="flex flex-row items-center gap-3 sm:gap-4 h-20">
          <img :src="siteInfo.logo" class="h-[60px] w-auto" alt="Logo Pemko" />
          <div class="flex flex-col">
            <span class="text-[24px] font-semibold leading-tight custom-gradient-text">{{ siteInfo.name }}</span>
            <span class="text-[16px] font-semibold leading-tight custom-gradient-text">Pemko Tanjungpinang</span>
          </div>
        </router-link>
      </div>
    </header>

    <main class="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-20">
      <section class="w-full text-center py-4">
        <h1 class="text-lg font-semibold text-[#04b0b1] mt-1">
          Survei Kepuasan Masyarakat
        </h1>
        <h2 class="text-[28px] sm:text-[32px] font-semibold text-[#04b0b1] leading-tight">{{ surveyData.opdName }}</h2>
      </section>

      <div class="w-full flex items-start justify-center px-2 sm:px-12 my-8">
        <div class="flex flex-col items-center text-center step-item completed">
          <div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl"><i class="fa-solid fa-user"></i></div>
          <p class="mt-2 text-sm sm:text-base font-semibold">Responden</p>
        </div>
        <div class="step-line completed relative top-[28px] sm:top-[36px]"></div>
        <div class="flex flex-col items-center text-center step-item active">
          <div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl"><i class="fa-solid fa-clipboard-list"></i></div>
          <p class="mt-2 text-sm sm:text-base font-semibold">Survey</p>
        </div>
        <div class="step-line relative top-[28px] sm:top-[36px]"></div>
        <div class="flex flex-col items-center text-center step-item">
          <div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl"><i class="fa-solid fa-comment-dots"></i></div>
          <p class="mt-2 text-sm sm:text-base font-semibold">Kritik & Saran</p>
        </div>
        <div class="step-line relative top-[28px] sm:top-[36px]"></div>
        <div class="flex flex-col items-center text-center step-item">
          <div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl"><i class="fa-solid fa-check"></i></div>
          <p class="mt-2 text-sm sm:text-base font-semibold">Selesai</p>
        </div>
      </div>

      <section class="form-card-gradient w-full px-6 sm:px-12 py-8 sm:py-10 rounded-2xl shadow-[-4px_4px_10px_0px_rgba(0,0,0,0.17)] flex flex-col mt-4 relative">
        <div class="absolute top-3 right-3 group z-20">
            <div @click="isModalVisible = true" class="w-6 h-6 flex items-center justify-center rounded-full bg-[#209FA0] text-white cursor-pointer shadow-md hover:opacity-90 transition-opacity"><i class="fa-solid fa-info text-white text-sm"></i></div>
            <div class="absolute right-0 top-full mt-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Petunjuk Survei<div class="absolute -top-1 right-2 w-2 h-2 bg-gray-800 rotate-45"></div></div>
        </div>
        
        <div v-for="(indicator, index) in surveyData.indicators" :key="indicator.name" :class="{'mt-10 pt-10 border-t-2 border-cyan-100' : index > 0}">
          <div class="mb-8">
              <h3 class="text-2xl font-bold text-[#009293] text-center">
                  "{{ indicator.name }}"
              </h3>
          </div>
          <div class="space-y-6">
              <div v-for="(item, qIndex) in indicator.questions" :key="item.id" class="flex flex-col">
                  <p class="text-base text-[#016465] mb-3">{{ qIndex + 1 }}. {{ item.text }}</p>
                  <div class="flex flex-row items-center gap-3">
                      <div class="flex items-center space-x-1 sm:space-x-2">
                          <i v-for="n in 4" :key="n" 
                             @click="item.rating = n"
                             :class="['fa-solid fa-star text-2xl cursor-pointer transition-transform duration-150 ease-in-out hover:scale-125', n <= item.rating ? 'text-yellow-400' : 'text-gray-300']">
                          </i>
                      </div>
                      <span v-if="item.rating > 0" :class="['px-2 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm font-semibold rounded-full', getLabelClass(item.rating)]">
                          {{ getLabelText(item.rating) }}
                      </span>
                  </div>
              </div>
          </div>
        </div>

        <div class="flex flex-col-reverse sm:flex-row sm:justify-between items-center pt-8 mt-10 border-t-2 border-cyan-100 gap-4 sm:gap-0">
            <router-link :to="`/data-responden/${route.params.id}`" class="w-full sm:w-auto text-center px-8 py-2 border border-[#009293] rounded-[12px] text-[#009293] font-semibold hover:bg-cyan-50 transition-colors">
              &larr; Sebelumnya
            </router-link>
            <button @click="handleNext" class="w-full sm:w-auto text-center px-8 py-2 bg-[#00c8c9] text-white font-semibold rounded-[12px] hover:bg-[#00a6a7] transition-colors">
              Selanjutnya &rarr;
            </button>
        </div>
      </section>
    </main>

    <div v-if="isModalVisible" class="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div class="bg-[#00c8c9] text-white rounded-2xl shadow-xl p-8 max-w-sm w-full relative">
        <button @click="isModalVisible = false" class="absolute top-3 right-3 w-8 h-8 bg-white text-[#00c8c9] rounded-full flex items-center justify-center font-bold text-xl hover:bg-gray-200 transition-colors">&times;</button>
        <h3 class="text-2xl font-bold text-center mb-6">Petunjuk Penilaian Survei</h3>
        <div class="space-y-3 text-lg">
          <p>1. Bintang 1 = Sangat Buruk</p><p>2. Bintang 2 = Buruk</p><p>3. Bintang 3 = Baik</p><p>4. Bintang 4 = Sangat Baik</p>
        </div>
      </div>
    </div>
  </div>

  <footer class="w-full relative h-72">
    <img src="/images/Group Footer.svg" class="w-[150vw] h-[120%] sm:h-auto sm:w-auto sm:min-w-[108vw] absolute bottom-0 -right-0 sm:-right-10 -z-10 object-cover" alt="Footer Background" />
  </footer>
</template>

<style>
/* Style tidak ada perubahan */
.content-wrapper > header.header-solid {
  background-color: #ffffff !important;
  background-image: none !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07);
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

.content-wrapper > header.header-solid,
.content-wrapper > header.header-solid.scrolled {
  background-color: #ffffff !important;
  background-image: none !important;
}

@media screen and (max-width: 1023px) {
  .content-wrapper > header.header-solid {
    background-color: #ffffff !important;
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

.form-card-gradient {
  background: linear-gradient(225deg, #49F7F7 0%, #FFFFFF 80%);
}
</style>