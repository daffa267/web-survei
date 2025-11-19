<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios'; 

const siteInfo = ref({
  logo: '/images/Logo-Pemko.png',
  name: '...',
  nama_aplikasi: 'Memuat...',
});

const opdName = ref('');
const serviceName = ref('');
const serviceId = ref(null);
const showToast = ref(false);
const toastMessage = ref('');
const isEditing = ref(false);

const nama = ref('');
const umur = ref(17); 
const jenisKelamin = ref('');
const pendidikan = ref('');
const pekerjaan = ref('');

const initialRespondentData = ref(null);

const pendidikanOptions = ref([]);
const pekerjaanOptions = ref([]);

const router = useRouter();
const route = useRoute();

const errors = reactive({
  jenisKelamin: false,
  pendidikan: false,
  pekerjaan: false,
});

watch(jenisKelamin, (newValue) => { if (newValue) errors.jenisKelamin = false; });
watch(pendidikan, (newValue) => { if (newValue) errors.pendidikan = false; });
watch(pekerjaan, (newValue) => { if (newValue) errors.pekerjaan = false; });

// UPDATE: Watcher untuk memvalidasi input angka umur
watch(umur, (newValue) => {
  // Menangani jika input dikosongkan sementara
  if (newValue === '' || newValue === null) return;

  const numValue = Number(newValue);
  // Memastikan nilai tidak kurang dari 17 atau lebih dari 80
  if (numValue < 17) {
    umur.value = 17;
  } else if (numValue > 80) {
    umur.value = 80;
  }
});

// UPDATE: Computed property untuk style background slider progresif
const sliderStyle = computed(() => {
  const min = 17;
  const max = 80;
  // Menangani nilai umur kosong saat user menghapus input angka
  const currentValue = Number(umur.value) || min;
  const percentage = ((currentValue - min) / (max - min)) * 100;
  return {
    background: `linear-gradient(to right, #00c8c9 ${percentage}%, #ffffff ${percentage}%)`
  };
});


const getPendidikanOptions = async () => {
  try {
    const response = await axios.get('https://admin.skm.tanjungpinangkota.go.id/api/form/pendidikan-option');
    if (response.data.success) {
      pendidikanOptions.value = response.data.data;
    }
  } catch (error) { console.error('Gagal mengambil opsi pendidikan:', error); }
};

const getPekerjaanOptions = async () => {
  try {
    const response = await axios.get('https://admin.skm.tanjungpinangkota.go.id/api/form/pekerjaan-option');
    if (response.data.success) {
      pekerjaanOptions.value = response.data.data;
    }
  } catch (error) { console.error('Gagal mengambil opsi pekerjaan:', error); }
};

onMounted(async () => {
  window.scrollTo(0, 0);
  opdName.value = route.query.opd_name || 'Dinas Tidak Ditemukan';
  serviceName.value = route.query.service_name || '';

  if (route.query.from === 'survey') {
    const savedData = sessionStorage.getItem('respondentData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Mengisi form dengan data yang tersimpan
        nama.value = parsedData.name === 'Anonim' ? '' : parsedData.name;
        umur.value = parsedData.umur || 17; 
        if (parsedData.gender) {
          jenisKelamin.value = parsedData.gender.charAt(0).toUpperCase() + parsedData.gender.slice(1);
        }
        pendidikan.value = parsedData.id_pendidikan || '';
        pekerjaan.value = parsedData.id_pekerjaan || '';
        isEditing.value = true;

        // UPDATE: Simpan "snapshot" dari data yang dimuat untuk perbandingan nanti
        initialRespondentData.value = JSON.stringify({
          nama: nama.value,
          umur: umur.value,
          jenisKelamin: jenisKelamin.value,
          pendidikan: pendidikan.value,
          pekerjaan: pekerjaan.value,
        });

      } catch (e) {
        sessionStorage.removeItem('respondentData');
      }
    }
  } else {
    sessionStorage.removeItem('respondentData');
    isEditing.value = false;
  }

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
  } catch (error) { console.error("Gagal mengambil data pengaturan situs:", error); }

  getPendidikanOptions();
  getPekerjaanOptions();
});

const updateUmur = (value) => {
  let numValue = parseInt(value) || 17;
  // Pastikan nilai berada di antara 17 dan 80
  if (numValue < 17) numValue = 17;
  if (numValue > 80) numValue = 80;
  umur.value = numValue;
};

const handleNext = () => {
  Object.keys(errors).forEach(key => errors[key] = false);
  let validationFailed = false;

  if (!jenisKelamin.value) { errors.jenisKelamin = true; validationFailed = true; }
  if (!pendidikan.value) { errors.pendidikan = true; validationFailed = true; }
  if (!pekerjaan.value) { errors.pekerjaan = true; validationFailed = true; }

  if (validationFailed) { return; }

  const navigateToSurvey = () => {
    const idSurvey = route.params.id;
    if (idSurvey) {
      router.push({ 
        path: `/survei/${idSurvey}`, 
        query: { 
          opd_name: opdName.value,
          service_name: serviceName.value 
        } 
      });
    }
  };

  // UPDATE: Cek apakah ada perubahan data sebelum menampilkan notifikasi
  const currentData = JSON.stringify({
    nama: nama.value,
    umur: umur.value,
    jenisKelamin: jenisKelamin.value,
    pendidikan: pendidikan.value,
    pekerjaan: pekerjaan.value,
  });

  let hasChanged = true;
  if (isEditing.value && initialRespondentData.value === currentData) {
    hasChanged = false;
  }

  const respondentData = {
    id_pendidikan: parseInt(pendidikan.value),
    id_pekerjaan: parseInt(pekerjaan.value),
    name: nama.value || 'Anonim',
    umur: parseInt(umur.value),
    gender: jenisKelamin.value.toLowerCase(),
  };

  if (hasChanged) {
    sessionStorage.setItem('respondentData', JSON.stringify(respondentData));
    toastMessage.value = isEditing.value ? 'Data responden berhasil diubah' : 'Data responden berhasil disimpan';
    showToast.value = true;

    setTimeout(() => {
      showToast.value = false;
      navigateToSurvey();
    }, 2000);
  } else {
    // Jika tidak ada perubahan, langsung navigasi tanpa notifikasi
    navigateToSurvey();
  }
};
</script>

<template>
  <div class="content-wrapper relative">
    <Transition name="toast-fade">
      <div v-if="showToast" class="toast-notification">
        <p>{{ toastMessage }}</p>
      </div>
    </Transition>
    
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
        <h1 class="text-lg font-semibold text-[#04b0b1] mt-1">
          Survei Kepuasan Masyarakat
        </h1>
        <h2 class="text-[28px] sm:text-[32px] font-semibold text-[#04b0b1] leading-tight">
          {{ opdName }}
        </h2>
        <p v-if="serviceName" class="text-lg sm:text-xl text-[#04b0b1] font-semibold -mt-1">
          {{ serviceName }}
        </p>
      </section>

      <div class="w-full flex items-start justify-center px-2 sm:px-12 my-8">
        <div class="flex flex-col items-center text-center step-item active">
          <div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl"><i class="fa-solid fa-user"></i></div>
          <p class="mt-2 text-sm sm:text-base font-semibold">Responden</p>
        </div>
        <div class="step-line relative top-[28px] sm:top-[36px]"></div>
        <div class="flex flex-col items-center text-center step-item"><div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl"><i class="fa-solid fa-clipboard-list"></i></div><p class="mt-2 text-sm sm:text-base font-semibold">Survey</p></div>
        <div class="step-line relative top-[28px] sm:top-[36px]"></div>
        <div class="flex flex-col items-center text-center step-item"><div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl"><i class="fa-solid fa-comment-dots"></i></div><p class="mt-2 text-sm sm:text-base font-semibold">Kritik & Saran</p></div>
        <div class="step-line relative top-[28px] sm:top-[36px]"></div>
        <div class="flex flex-col items-center text-center step-item"><div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl"><i class="fa-solid fa-check"></i></div><p class="mt-2 text-sm sm:text-base font-semibold">Selesai</p></div>
      </div>
      <section class="form-card-gradient w-full px-6 sm:px-12 md:px-20 py-8 sm:py-10 rounded-2xl shadow-[-4px_4px_10px_0px_rgba(0,0,0,0.17)] flex flex-col mt-4 relative">
        <h3 class="text-2xl font-bold text-[#009293] mb-2 text-center">Data Responden</h3>
        <p class="text-sm text-left text-gray-600 mb-8 italic">Isian yang ditandai dengan bintang (<span class="text-red-500">*</span>) wajib diisi.</p>
        <form @submit.prevent="handleNext" class="space-y-2 flex-grow flex flex-col">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="nama" class="block text-sm font-semibold text-[#009293]">Nama Lengkap</label>
              <input v-model="nama" type="text" id="nama" placeholder="Masukkan nama lengkap anda" class="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-[12px] shadow-sm focus:outline-none focus:ring-[#00c8c9] focus:border-[#00c8c9] placeholder:italic" />
            </div>
            
            <div class="relative pb-5">
              <label for="umur" class="block text-sm font-semibold text-[#009293]">Umur</label>
              <div class="mt-1 flex items-center gap-4 pt-1">
                <input 
                  :value="umur"
                  @input="updateUmur($event.target.value)"
                  type="range" 
                  min="17" 
                  max="80"
                  step="1"
                  class="w-full h-2 rounded-lg appearance-none cursor-pointer range-slider-custom border border-gray-200"
                  :style="sliderStyle" />
                <input 
                  :value="umur"
                  @input="updateUmur($event.target.value)"
                  type="number" 
                  min="17" 
                  max="80"
                  class="umur-input text-[#007c7e] font-bold text-lg w-20 text-center bg-cyan-50 border border-cyan-200 rounded-md py-1 focus:outline-none focus:ring-2 focus:ring-[#00c8c9]" />
              </div>
            </div>
            </div>
          <div class="relative pb-5">
            <label class="block text-sm font-semibold text-[#009293]">Jenis Kelamin <span class="text-red-500">*</span></label>
            <div class="mt-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <label class="flex items-center bg-white border rounded-[12px] px-6 py-2 cursor-pointer hover:bg-cyan-50" :class="errors.jenisKelamin ? 'border-red-500' : 'border-gray-300'"><input v-model="jenisKelamin" type="radio" name="jenis_kelamin" value="Laki-laki" class="form-radio text-[#00c8c9] focus:ring-[#00c8c9]" /><span class="ml-3 text-[#016465]">Laki-laki</span></label>
              <label class="flex items-center bg-white border rounded-[12px] px-6 py-2 cursor-pointer hover:bg-cyan-50" :class="errors.jenisKelamin ? 'border-red-500' : 'border-gray-300'"><input v-model="jenisKelamin" type="radio" name="jenis_kelamin" value="Perempuan" class="form-radio text-[#00c8c9] focus:ring-[#00c8c9]" /><span class="ml-3 text-[#016465]">Perempuan</span></label>
            </div>
            <p v-if="errors.jenisKelamin" class="absolute bottom-0 left-0 text-xs text-red-600">Jenis kelamin wajib dipilih.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="relative pb-5">
              <label for="pendidikan" class="block text-sm font-semibold text-[#009293]">Pendidikan <span class="text-red-500">*</span></label>
              <select v-model="pendidikan" id="pendidikan" class="mt-1 block w-full px-4 py-2 bg-white border rounded-[12px] shadow-sm focus:outline-none text-[#016465]" :class="errors.pendidikan ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#00c8c9] focus:border-[#00c8c9]'"><option disabled value="">Pilih tingkat pendidikan</option><option v-for="option in pendidikanOptions" :key="option.id" :value="option.id">{{ option.name }}</option></select>
              <p v-if="errors.pendidikan" class="absolute bottom-0 left-0 text-xs text-red-600">Pendidikan wajib dipilih.</p>
            </div>
            <div class="relative pb-5">
              <label for="pekerjaan" class="block text-sm font-semibold text-[#009293]">Pekerjaan <span class="text-red-500">*</span></label>
              <select v-model="pekerjaan" id="pekerjaan" class="mt-1 block w-full px-4 py-2 bg-white border rounded-[12px] shadow-sm focus:outline-none text-[#016465]" :class="errors.pekerjaan ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#00c8c9] focus:border-[#00c8c9]'"><option disabled value="">Pilih pekerjaan anda</option><option v-for="option in pekerjaanOptions" :key="option.id" :value="option.id">{{ option.name }}</option></select>
              <p v-if="errors.pekerjaan" class="absolute bottom-0 left-0 text-xs text-red-600">Pekerjaan wajib dipilih.</p>
            </div>
          </div>
          <div class="flex flex-col-reverse sm:flex-row sm:justify-between items-center pt-8 mt-auto gap-4 sm:gap-0">
            <router-link :to="{ path: `/list-survey/${serviceId}`, query: { name: opdName } }" @click="clearRespondentData" class="w-full sm:w-auto text-center px-8 py-2 border border-[#009293] rounded-[12px] text-[#009293] font-semibold hover:bg-cyan-50 transition-colors">&larr; Sebelumnya</router-link>
            <button type="submit" class="w-full sm:w-auto text-center px-8 py-2 bg-[#00c8c9] text-white font-semibold rounded-[12px] hover:bg-[#00a6a7] transition-colors">Selanjutnya &rarr;</button>
          </div>
        </form>
      </section>
    </main>
  </div>
  <footer class="w-full relative h-72">
    <img src="/images/Group Footer.svg" class="w-[150vw] h-[120%] sm:h-auto sm:w-auto sm:min-w-[108vw] absolute bottom-0 -right-0 sm:-right-10 -z-10 object-cover" alt="Footer Background" />
  </footer>
</template>

<style scoped>
/* UPDATE: Style untuk Slider yang disempurnakan */
.range-slider-custom {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 5px;
  outline: none;
}

.range-slider-custom::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px; /* Lebar bulatan */
  height: 22px; /* Tinggi bulatan */
  background: #00c8c9;
  cursor: pointer;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
  /* Kalkulasi untuk memposisikan thumb di tengah garis */
  margin-top: 0; 
}

/* Thumb (bulatan) untuk Firefox */
.range-slider-custom::-moz-range-thumb {
  width: 22px;
  height: 22px;
  background: #00c8c9;
  cursor: pointer;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
}

/* UPDATE: Menghilangkan panah atas/bawah pada input angka */
.umur-input::-webkit-inner-spin-button,
.umur-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.umur-input {
  -moz-appearance: textfield; /* Untuk Firefox */
}


:deep(input::placeholder) {
  color: #82caca !important;
  opacity: 1 !important;
}

.content-wrapper > header.header-solid {
  background: #fff !important;
  background-image: none !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07);
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

@media screen and (max-width: 1023px) {
  .content-wrapper > header.header-solid {
    background: #fff !important;
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

.step-line {
  flex-grow: 1;
  height: 3.2px;
  background-color: #aaeeed;
  margin: 0 0.25rem;
}

.form-card-gradient {
  background: linear-gradient(225deg, #49f7f7 0, #fff 80%);
}

.toast-notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #209fa0;
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  font-weight: 600;
  font-size: 15px;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>