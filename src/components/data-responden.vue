<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // Efek scroll pada header
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

      <div class="w-full flex items-center justify-center px-4 sm:px-12 my-8">
        <div class="flex flex-col items-center text-center step-item active">
          <div class="step-icon">
            <i class="fa-solid fa-user"></i>
          </div>
          <p class="mt-2 text-base font-semibold">Responden</p>
        </div>
        <div class="step-line"></div>
        <div class="flex flex-col items-center text-center step-item">
          <div class="step-icon">
            <i class="fa-solid fa-file-alt"></i>
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

      <section class="form-card-gradient w-full px-12 sm:px-20 py-8 sm:py-10 rounded-2xl shadow-[-4px_4px_10px_0px_rgba(0,0,0,0.17)] flex flex-col mt-4">
        <h3 class="text-2xl font-bold text-[#009293] mb-6 text-center">
          Data Responden
        </h3>
        <form @submit.prevent="" class="space-y-6 flex-grow flex flex-col">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="nama" class="block text-sm font-semibold text-[#009293]">Nama Lengkap</label>
              <input type="text" id="nama" placeholder="Masukkan nama lengkap anda" class="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-[12px] shadow-sm focus:outline-none focus:ring-[#00c8c9] focus:border-[#00c8c9] placeholder:italic placeholder:text-[#82CACA]" />
            </div>
            <div>
              <label for="umur" class="block text-sm font-semibold text-[#009293]">Umur</label>
              <input type="number" id="umur" placeholder="Masukkan umur anda" class="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-[12px] shadow-sm focus:outline-none focus:ring-[#00c8c9] focus:border-[#00c8c9] placeholder:italic placeholder:text-[#82CACA]" />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-semibold text-[#009293]">Email/No.HP</label>
            <input type="text" id="email" placeholder="Masukkan email atau nomor HP anda" class="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-[12px] shadow-sm focus:outline-none focus:ring-[#00c8c9] focus:border-[#00c8c9] placeholder:italic placeholder:text-[#82CACA]" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-[#009293]">Jenis Kelamin</label>
            <div class="mt-2 flex space-x-4">
              <label class="flex items-center bg-white border border-gray-300 rounded-[12px] px-6 py-2 cursor-pointer hover:bg-cyan-50">
                <input type="radio" name="jenis_kelamin" value="laki-laki" class="form-radio text-[#00c8c9] focus:ring-[#00c8c9]" />
                <span class="ml-3 text-[#016465]">Laki-laki</span>
              </label>
              <label class="flex items-center bg-white border border-gray-300 rounded-[12px] px-6 py-2 cursor-pointer hover:bg-cyan-50">
                <input type="radio" name="jenis_kelamin" value="perempuan" class="form-radio text-[#00c8c9] focus:ring-[#00c8c9]" />
                <span class="ml-3 text-[#016465]">Perempuan</span>
              </label>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="pendidikan" class="block text-sm font-semibold text-[#009293]">Pendidikan</label>
              <select id="pendidikan" class="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-[12px] shadow-sm focus:outline-none focus:ring-[#00c8c9] focus:border-[#00c8c9] text-[#016465]">
                <option>Pilih tingkat pendidikan</option>
                <option>SD</option>
                <option>SMP</option>
                <option>SMA/SMK</option>
                <option>D3/S1</option>
                <option>S2/S3</option>
              </select>
            </div>
            <div>
              <label for="pekerjaan" class="block text-sm font-semibold text-[#009293]">Pekerjaan</label>
              <select id="pekerjaan" class="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-[12px] shadow-sm focus:outline-none focus:ring-[#00c8c9] focus:border-[#00c8c9] text-[#016465]">
                <option>Pilih pekerjaan anda</option>
                <option>PNS/TNI/POLRI</option>
                <option>Wiraswasta</option>
                <option>Karyawan Swasta</option>
                <option>Pelajar/Mahasiswa</option>
                <option>Lainnya</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="jenis_layanan" class="block text-sm font-semibold text-[#009293]">Jenis Layanan</label>
              <select id="jenis_layanan" class="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-[12px] shadow-sm focus:outline-none focus:ring-[#00c8c9] focus:border-[#00c8c9] text-[#016465]">
                <option>Pilih jenis layanan</option>
                <option>Layanan A</option>
                <option>Layanan B</option>
              </select>
            </div>
            <div>
              <label for="petugas_pelayanan" class="block text-sm font-semibold text-[#009293]">Petugas Pelayanan</label>
              <select id="petugas_pelayanan" class="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-[12px] shadow-sm focus:outline-none focus:ring-[#00c8c9] focus:border-[#00c8c9] text-[#016465]">
                <option>Pilih petugas</option>
                <option>Petugas 1</option>
                <option>Petugas 2</option>
              </select>
            </div>
          </div>

          <div class="flex justify-between items-center pt-8 mt-auto">
            <router-link to="/kategori-dinas" class="px-8 py-2 border border-[#009293] rounded-[12px] text-[#009293] font-semibold hover:bg-cyan-50 transition-colors">
              &larr; Sebelumnya
            </router-link>
            <router-link to="/survei" class="px-8 py-2 bg-[#00c8c9] text-white font-semibold rounded-[12px] hover:bg-[#00a6a7] transition-colors">
              Selanjutnya &rarr;
            </router-link>
          </div>
        </form>
      </section>
    </main>
  </div>

  <footer class="w-full relative h-48">
    <img src="/images/Group Footer.svg" class="w-full min-w-[108vw] h-auto absolute bottom-0 left-[103%] -translate-x-1/2 -z-10 mt-12" alt="Footer Background" />
  </footer>
</template>

<style>
/* Global & Reusable Styles */
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

/* Header Styles */
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

/* Stepper Styles */
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

.form-card-gradient {
  background: linear-gradient(225deg, #49F7F7 0%, #FFFFFF 80%);
}
</style>