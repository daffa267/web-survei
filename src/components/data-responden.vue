<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; 

const siteInfo = ref({
  logo: '/images/Logo-Pemko.png',
  name: '...',
});

// State untuk menampung nilai dari setiap input form
const nama = ref('');
const umur = ref('');
const emailHp = ref('');
const jenisKelamin = ref('');
const pendidikan = ref('');
const pekerjaan = ref('');
const jenisLayanan = ref('');

// State baru untuk menampung opsi dinamis
const pendidikanOptions = ref([]);
const jenisLayananOptions = ref([]);
const pekerjaanOptions = ref([]);

const router = useRouter();

// State reaktif untuk melacak error pada setiap field
const errors = reactive({
  umur: false,
  emailHp: false,
  jenisKelamin: false,
  pendidikan: false,
  pekerjaan: false,
  jenisLayanan: false,
});

const getPendidikanOptions = async () => {
  try {
    const response = await axios.get('https://admin.skm.tanjungpinangkota.go.id/api/form/pendidikan-option');
    
    if (response.data.success) {
      pendidikanOptions.value = response.data.data;
    }
  } catch (error) {
    console.error('Gagal mengambil opsi pendidikan:', error);
  }
};

const getJenisLayananOptions = async () => {
  try {
    // Menggunakan API endpoint untuk jenis layanan
    const response = await axios.get('https://admin.skm.tanjungpinangkota.go.id/api/form/layanan-opd-option?id_opd=102');
    
    if (response.data.success) {
      // Simpan data yang diambil ke dalam state baru
      jenisLayananOptions.value = response.data.data;
    }
  } catch (error) {
    console.error('Gagal mengambil opsi jenis layanan:', error);
  }
};

const getPekerjaanOptions = async () => {
  try {
    const response = await axios.get('https://admin.skm.tanjungpinangkota.go.id/api/form/pekerjaan-option');
    
    if (response.data.success) {
      pekerjaanOptions.value = response.data.data;
    }
  } catch (error) {
    console.error('Gagal mengambil opsi pekerjaan:', error);
  }
};
onMounted(async () => {
  try {
    const response = await fetch('https://admin.skm.tanjungpinangkota.go.id/api/site-setting');
    if (!response.ok) throw new Error('Network response was not ok');
    const result = await response.json();

    if (result.success && result.data) {
      const data = result.data;
      siteInfo.value = {
        logo: data.file_logo,
        name: data.name.toUpperCase(),
      };
    }
  } catch (error) {
    console.error("Gagal mengambil data pengaturan situs:", error);
  }

  getPendidikanOptions();
  getJenisLayananOptions();
  getPekerjaanOptions();
});

// Fungsi untuk menangani klik tombol "Selanjutnya"
const handleNext = () => {
  Object.keys(errors).forEach(key => errors[key] = false);
  let validationFailed = false;

  if (!umur.value) { errors.umur = true; validationFailed = true; }
  if (!emailHp.value) { errors.emailHp = true; validationFailed = true; }
  if (!jenisKelamin.value) { errors.jenisKelamin = true; validationFailed = true; }
  if (!pendidikan.value) { errors.pendidikan = true; validationFailed = true; }
  if (!pekerjaan.value) { errors.pekerjaan = true; validationFailed = true; }
  if (!jenisLayanan.value) { errors.jenisLayanan = true; validationFailed = true; }

  if (!validationFailed) {
    router.push('/survei');
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
        <h2 class="text-[28px] sm:text-[32px] font-semibold text-[#04b0b1] leading-tight">
          Dinas Komunikasi dan Informatika
        </h2>
      </section>

      <div class="w-full flex items-start justify-center px-2 sm:px-12 my-8">
        <div class="flex flex-col items-center text-center step-item active">
          <div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl">
            <i class="fa-solid fa-user"></i>
          </div>
          <p class="mt-2 text-sm sm:text-base font-semibold">Responden</p>
        </div>
        <div class="step-line relative top-[28px] sm:top-[36px]"></div>
        <div class="flex flex-col items-center text-center step-item">
          <div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl">
            <i class="fa-solid fa-clipboard-list"></i>
          </div>
          <p class="mt-2 text-sm sm:text-base font-semibold">Survey</p>
        </div>
        <div class="step-line relative top-[28px] sm:top-[36px]"></div>
        <div class="flex flex-col items-center text-center step-item">
          <div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl">
            <i class="fa-solid fa-comment-dots"></i>
          </div>
          <p class="mt-2 text-sm sm:text-base font-semibold">Kritik & Saran</p>
        </div>
        <div class="step-line relative top-[28px] sm:top-[36px]"></div>
        <div class="flex flex-col items-center text-center step-item">
          <div class="step-icon w-14 h-14 text-xl sm:w-[72px] sm:h-[72px] sm:text-2xl">
            <i class="fa-solid fa-check"></i>
          </div>
          <p class="mt-2 text-sm sm:text-base font-semibold">Selesai</p>
        </div>
      </div>
      <section class="form-card-gradient w-full px-6 sm:px-12 md:px-20 py-8 sm:py-10 rounded-2xl shadow-[-4px_4px_10px_0px_rgba(0,0,0,0.17)] flex flex-col mt-4 relative">
        <h3 class="text-2xl font-bold text-[#009293] mb-2 text-center">
          Data Responden
        </h3>
        <p class="text-sm text-left text-gray-600 mb-8 italic">
          Isian yang ditandai dengan bintang (<span class="text-red-500">*</span>) wajib diisi.
        </p>
        <form @submit.prevent="handleNext" class="space-y-2 flex-grow flex flex-col">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="nama" class="block text-sm font-semibold text-[#009293]">Nama Lengkap</label>
              <input v-model="nama" type="text" id="nama" placeholder="Masukkan nama lengkap anda" class="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-[12px] shadow-sm focus:outline-none focus:ring-[#00c8c9] focus:border-[#00c8c9] placeholder:italic" />
            </div>
            <div class="relative pb-5">
              <label for="umur" class="block text-sm font-semibold text-[#009293]">Umur <span class="text-red-500">*</span></label>
              <input v-model="umur" type="number" id="umur" placeholder="Masukkan umur anda" class="mt-1 block w-full px-4 py-2 bg-white border rounded-[12px] shadow-sm focus:outline-none placeholder:italic" 
                     :class="errors.umur ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#00c8c9] focus:border-[#00c8c9]'" />
              <p v-if="errors.umur" class="absolute bottom-0 left-0 text-xs text-red-600">Umur wajib diisi.</p>
            </div>
          </div>

          <div class="relative pb-5">
            <label for="email" class="block text-sm font-semibold text-[#009293]">Email/No.HP <span class="text-red-500">*</span></label>
            <input v-model="emailHp" type="text" id="email" placeholder="Masukkan email atau nomor HP anda" class="mt-1 block w-full px-4 py-2 bg-white border rounded-[12px] shadow-sm focus:outline-none placeholder:italic"
                   :class="errors.emailHp ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#00c8c9] focus:border-[#00c8c9]'" />
            <p v-if="errors.emailHp" class="absolute bottom-0 left-0 text-xs text-red-600">Email/No.HP wajib diisi.</p>
          </div>

          <div class="relative pb-5">
            <label class="block text-sm font-semibold text-[#009293]">Jenis Kelamin <span class="text-red-500">*</span></label>
            <div class="mt-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <label class="flex items-center bg-white border rounded-[12px] px-6 py-2 cursor-pointer hover:bg-cyan-50"
                     :class="errors.jenisKelamin ? 'border-red-500' : 'border-gray-300'">
                <input v-model="jenisKelamin" type="radio" name="jenis_kelamin" value="laki-laki" class="form-radio text-[#00c8c9] focus:ring-[#00c8c9]" />
                <span class="ml-3 text-[#016465]">Laki-laki</span>
              </label>
              <label class="flex items-center bg-white border rounded-[12px] px-6 py-2 cursor-pointer hover:bg-cyan-50"
                     :class="errors.jenisKelamin ? 'border-red-500' : 'border-gray-300'">
                <input v-model="jenisKelamin" type="radio" name="jenis_kelamin" value="perempuan" class="form-radio text-[#00c8c9] focus:ring-[#00c8c9]" />
                <span class="ml-3 text-[#016465]">Perempuan</span>
              </label>
            </div>
            <p v-if="errors.jenisKelamin" class="absolute bottom-0 left-0 text-xs text-red-600">Jenis kelamin wajib dipilih.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="relative pb-5">
              <label for="pendidikan" class="block text-sm font-semibold text-[#009293]">Pendidikan <span class="text-red-500">*</span></label>
              <select v-model="pendidikan" id="pendidikan" class="mt-1 block w-full px-4 py-2 bg-white border rounded-[12px] shadow-sm focus:outline-none text-[#016465]"
                      :class="errors.pendidikan ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#00c8c9] focus:border-[#00c8c9]'">
                <option disabled value="">Pilih tingkat pendidikan</option>
                <option v-for="option in pendidikanOptions" :key="option.id" :value="option.id">
                  {{ option.name }}
                </option>
              </select>
              <p v-if="errors.pendidikan" class="absolute bottom-0 left-0 text-xs text-red-600">Pendidikan wajib dipilih.</p>
            </div>

            <div class="relative pb-5">
              <label for="pekerjaan" class="block text-sm font-semibold text-[#009293]">Pekerjaan <span class="text-red-500">*</span></label>
              <select v-model="pekerjaan" id="pekerjaan" class="mt-1 block w-full px-4 py-2 bg-white border rounded-[12px] shadow-sm focus:outline-none text-[#016465]"
                      :class="errors.pekerjaan ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#00c8c9] focus:border-[#00c8c9]'">
                <option disabled value="">Pilih pekerjaan anda</option>
                <option v-for="option in pekerjaanOptions" :key="option.id" :value="option.id">
                  {{ option.name }}
                </option>
              </select>
              <p v-if="errors.pekerjaan" class="absolute bottom-0 left-0 text-xs text-red-600">Pekerjaan wajib dipilih.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="relative pb-5">
              <label for="jenis_layanan" class="block text-sm font-semibold text-[#009293]">Jenis Layanan <span class="text-red-500">*</span></label>
              <select v-model="jenisLayanan" id="jenis_layanan" class="mt-1 block w-full px-4 py-2 bg-white border rounded-[12px] shadow-sm focus:outline-none text-[#016465]"
                      :class="errors.jenisLayanan ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#00c8c9] focus:border-[#00c8c9]'">
                <option disabled value="">Pilih jenis layanan</option>
                <option v-for="option in jenisLayananOptions" :key="option.id" :value="option.id">
                  {{ option.name }}
                </option>
              </select>
              <p v-if="errors.jenisLayanan" class="absolute bottom-0 left-0 text-xs text-red-600">Jenis layanan wajib dipilih.</p>
            </div>
          </div>
          <div class="flex flex-col-reverse sm:flex-row sm:justify-between items-center pt-8 mt-auto gap-4 sm:gap-0">
            <router-link to="/kategori-dinas" class="w-full sm:w-auto text-center px-8 py-2 border border-[#009293] rounded-[12px] text-[#009293] font-semibold hover:bg-cyan-50 transition-colors">
              &larr; Sebelumnya
            </router-link>
            <button @click="handleNext" type="button" class="w-full sm:w-auto text-center px-8 py-2 bg-[#00c8c9] text-white font-semibold rounded-[12px] hover:bg-[#00a6a7] transition-colors">
              Selanjutnya &rarr;
            </button>
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
:deep(input::placeholder) {
  color: #82CACA !important;
  opacity: 1 !important;     
}

.content-wrapper > header.header-solid {
  background: #ffffff !important;
  background-image: none !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07);
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

.content-wrapper > header.header-solid,
.content-wrapper > header.header-solid.scrolled {
  background: #ffffff !important;
  background-image: none !important;
}

@media screen and (max-width: 1023px) {
  .content-wrapper > header.header-solid {
    background: #ffffff !important;
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
  background: linear-gradient(135deg, #22d3ee 0%, #26ebd2 50%, #06b6d4 100%);
  border: none;
  color: white;
}
.step-line {
  flex-grow: 1;
  height: 3.2px;
  background-color: #aaeeed;
  margin: 0 0.25rem;
}

.form-card-gradient {
  background: linear-gradient(225deg, #49F7F7 0%, #FFFFFF 80%);
}
</style>