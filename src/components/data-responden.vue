<script setup>
// onMounted dan fungsi handleScroll telah dihapus karena tidak lagi diperlukan.
</script>

<template>
  <div class="content-wrapper">
    <header class="header-solid w-full pl-1 pr-4 sm:pl-2 sm:pr-6 lg:pl-4 lg:pr-8 py-1 sm:py-2 fixed top-0 left-0 z-50">
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
        <div @click="isModalVisible = true" class="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full bg-[#209FA0] text-white cursor-pointer shadow-md hover:opacity-90 transition-opacity">
            <i class="fa-solid fa-info text-white text-sm"></i>
        </div>
        <h3 class="text-2xl font-bold text-[#009293] mb-6 text-center">
          Data Responden
        </h3>
        <form @submit.prevent="" class="space-y-6 flex-grow flex flex-col">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="nama" class="block text-sm font-semibold text-[#009293]">Nama Lengkap</label>
              <input type="text" id="nama" placeholder="Masukkan nama lengkap anda" class="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-[12px] shadow-sm focus:outline-none focus:ring-[#00c8c9] focus:border-[#00c8c9] placeholder:italic" />
            </div>
            <div>
              <label for="umur" class="block text-sm font-semibold text-[#009293]">Umur</label>
              <input type="number" id="umur" placeholder="Masukkan umur anda" class="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-[12px] shadow-sm focus:outline-none focus:ring-[#00c8c9] focus:border-[#00c8c9] placeholder:italic" />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-semibold text-[#009293]">Email/No.HP</label>
            <input type="text" id="email" placeholder="Masukkan email atau nomor HP anda" class="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-[12px] shadow-sm focus:outline-none focus:ring-[#00c8c9] focus:border-[#00c8c9] placeholder:italic" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-[#009293]">Jenis Kelamin</label>
            <div class="mt-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
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

          <div class="flex flex-col-reverse sm:flex-row sm:justify-between items-center pt-8 mt-auto gap-4 sm:gap-0">
            <router-link to="/kategori-dinas" class="w-full sm:w-auto text-center px-8 py-2 border border-[#009293] rounded-[12px] text-[#009293] font-semibold hover:bg-cyan-50 transition-colors">
              &larr; Sebelumnya
            </router-link>
            <router-link to="/survei" class="w-full sm:w-auto text-center px-8 py-2 bg-[#00c8c9] text-white font-semibold rounded-[12px] hover:bg-[#00a6a7] transition-colors">
              Selanjutnya &rarr;
            </router-link>
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