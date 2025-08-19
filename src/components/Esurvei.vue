<script setup>
import { onMounted } from 'vue';
onMounted(() => {
  const handleScroll = () => {
    const header = document.querySelector("header");
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll);

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

      if (navName === "beranda") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const targetSection = document.getElementById(navName);
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }

      scrollTimeout = setTimeout(() => {
        isClickScrolling = false;
      }, 800);
    });
  });

  const handleScrollNavUpdate = () => {
    if (isClickScrolling) return;

    const scrollY = window.pageYOffset;
    let currentSectionId = "beranda";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 150) {
        currentSectionId = section.getAttribute("id");
      }
    });

    const activeItem = document.querySelector(
      `.nav-item[data-nav="${currentSectionId}"]`
    );
    updateNavIndicator(activeItem);
  };
  window.addEventListener("scroll", handleScrollNavUpdate);

  handleScroll();
  setTimeout(() => {
    const initialActiveItem = document.querySelector(
      ".nav-item[data-nav='beranda']"
    );
    updateNavIndicator(initialActiveItem);
  }, 100);

  const ctx = document.getElementById("opdChart")?.getContext("2d");
  if (ctx && typeof Chart !== "undefined") {
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["OPD 1", "OPD 2", "OPD 3", "OPD 4", "OPD 5", "OPD 6", "OPD 7", "OPD 8", "OPD 9", "OPD 10"],
        datasets: [{
          label: "Nilai Pelayanan",
          data: [3.2, 4.1, 3.8, 3.2, 3.8, 4.2, 4.5, 3.9, 3.3, 4.1],
          backgroundColor: ["#00a0a1", "#00c8c9", "#00a0a1", "#00c8c9", "#00a0a1", "#00c8c9", "#00a0a1", "#00c8c9", "#00a0a1", "#00c8c9"],
          borderRadius: 4,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: "rgba(0, 192, 201, 0.9)",
            titleColor: "#ffffff",
            bodyColor: "#ffffff",
            borderColor: "#00c8c9",
            borderWidth: 1,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
            grid: { color: "rgba(0, 192, 201, 0.1)" },
            ticks: { color: "#00c8c9", font: { family: "Archivo" } },
          },
          x: {
            grid: { display: false },
            ticks: { color: "#00c8c9", font: { family: "Archivo" } },
          },
        },
        animation: { duration: 1000, easing: "easeOutQuart" },
      },
    });
  } else {
    console.warn("Chart.js atau canvas tidak ditemukan.");
  }
});

const toggleMobileMenu = () => {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("hidden");
};
</script>

<template>
  <div class="content-wrapper mb-60">
    <header class="w-full px-4 sm:px-6 lg:px-8 py-2 sm:py-3 fixed top-0 left-0 z-50">
      <div class="flex flex-row justify-between items-center w-full max-w-[1280px] mx-auto">
        <div class="flex flex-row items-center gap-3 sm:gap-4">
          <img src="/images/img_logo_pemkot_1.png" class="w-[48px] h-[62px]" alt="Logo Pemkot" />
          <div class="flex flex-col">
            <span class="text-[24px] font-semibold leading-tight custom-gradient-text">E-Survei</span>
            <span class="text-[16px] font-semibold leading-tight custom-gradient-text">Pemkot Tanjungpinang</span>
          </div>
        </div>

        <nav class="hidden lg:flex flex-row items-center gap-6 xl:gap-8 relative">
          <div id="nav-indicator" class="absolute left-0 top-1/2 h-10 w-24 bg-white rounded-full -z-10" style="transform-origin: center;"></div>
          <button class="px-4 py-2 relative z-10 text-white font-semibold text-sm hover:text-[#01c4c6] transition-colors nav-item" data-nav="beranda">
            Beranda
          </button>
          <a href="#tentang" class="px-4 py-2 relative z-10 text-white font-semibold text-sm hover:text-[#01c4c6] transition-colors nav-item" data-nav="tentang">
            Tentang
          </a>
          <a href="#unsur" class="px-4 py-2 relative z-10 text-white font-semibold text-sm hover:text-[#01c4c6] transition-colors nav-item" data-nav="unsur">
            Unsur Survei
          </a>
          <router-link to="/kategori-opd" class="flex items-center justify-center gap-2 px-4 h-10 bg-[#209fa0] text-white font-semibold text-sm rounded-2xl hover:bg-[#1a8485] transition-colors">
            <img src="/images/img_heroiconsoutlinelogin.svg" class="w-5 h-5" alt="Login" />
            Mulai Survei
          </router-link>
        </nav>

        <button class="lg:hidden p-2 text-white" @click="toggleMobileMenu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div id="mobileMenu" class="hidden lg:hidden mt-4 pb-4">
        <div class="flex flex-col gap-3">
          <button class="px-4 py-2 bg-white text-[#01c4c6] font-semibold text-sm rounded-2xl text-left">
            Beranda
          </button>
          <a href="#tentang" class="text-white font-semibold text-sm py-2">
            Tentang
          </a>
          <a href="#unsur" class="text-white font-semibold text-sm py-2">
            Unsur Survei
          </a>
          <router-link to="/kategori-opd" class="flex items-center gap-2 px-4 py-2 bg-[#209fa0] text-white font-semibold text-sm rounded-2xl w-fit">
            <img src="/images/img_heroiconsoutlinelogin.svg" class="w-5 h-5" alt="Login" />
            Mulai Survei
          </router-link>
        </div>
      </div>
    </header>

    <div class="relative">
      <div class="absolute top-0 right-0 w-full h-[1200px] z-0 pointer-events-none overflow-hidden">
        <img src="/images/Line 2.svg" class="absolute top-0 right-0 w-[970.76px] h-[916px]" alt="Background Line 2" />
        <img src="/images/Line 3.svg" class="absolute top-[260px] right-[-150px] w-[530.12px] h-[441.59px] scale-125" alt="Background Line 3" />
        <img src="/images/Line 1.svg" class="absolute top-0 right-0 w-[886px] h-[651px]" alt="Background Line 1" />
      </div>

      <main class="relative w-full min-h-[800px] flex items-center z-10">
        <div class="w-full max-w-[1280px] mx-auto pl-0 pr-8 flex items-center justify-between">
          <div class="flex flex-col w-full max-w-lg">
            <h1 class="text-[40px] font-semibold text-[#04b0b1] leading-tight mb-6 max-w-md">
              Survei Kepuasan Masyarakat
            </h1>
            <p class="text-[16px] text-[#04b0b1] leading-relaxed mb-8 text-justify">
              SURVEI KEPUASAN MASYARAKAT (SKM) adalah data dan informasi tentang tingkat kepuasan masyarakat yang diperoleh dari hasil pengukuran secara kuantitatif dan kualitatif atas pendapat masyarakat dalam memperoleh pelayanan dari aparatur penyelenggara pelayanan publik.
            </p>
            <a href="/kategori-opd" class="group flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-[#04b0b1] text-[#04b0b1] font-semibold text-sm rounded-2xl hover:bg-[#04b0b1] hover:text-white transition-all duration-300 w-fit">
              Mulai Survey
              <img src="/images/img_heroicons_outline_login_cyan_600.svg" class="w-5 h-5 group-hover:invert group-hover:brightness-0 group-hover:transition-all group-hover:duration-300" alt="Arrow" />
            </a>
          </div>

          <div class="relative w-[486px] h-auto mr-12">
            <img src="/images/Line 22.svg" class="absolute top-1/2 left-1/2 -translate-x-[calc(50%-90px)] -translate-y-[calc(50%-97px)] w-[400.28px] h-[360.91px]" alt="Phone Background" />
            <img src="/images/Line 21.svg" class="absolute top-1/2 left-1/2 -translate-x-[calc(50%-81.8px)] -translate-y-[calc(50%-78.2px)] w-[360.77px] h-[314.66px] scale-105" alt="Phone Background" />
            <img src="/images/hp dipegang 1.svg" class="relative z-10 w-full h-auto -translate-y-[20px] translate-x-[-4.6px]" alt="Phone Mockup" />
            <img src="/images/img_logo_pemkot_1.png" class="absolute z-20 top-1/2 left-1/2 -translate-x-[-5.7px] -translate-y-[50px]" style="width: 48px; height: 62px" alt="Logo on Phone" />
          </div>
        </div>

        <img src="/images/Group 3.svg" class="absolute left-0 top-[130px] w-[230px] h-auto z-20" alt="Decoration" />
        <img src="/images/Line 7.svg" class="absolute left-[0px] top-[270px] w-[180px] h-auto z-20" alt="Decoration" />
        <img src="/images/Group 4.svg" class="absolute left-[70px] top-[430px] w-[270px] h-auto z-20" alt="Decoration" />
      </main>

      <section id="tentang" class="relative w-full pl-2 pr-8 pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 mt-16 overflow-visible">
        <div class="absolute inset-0 z-0 overflow-visible">
          <img src="/images/wave-1.svg" class="absolute left-[-108px] top-[286px] w-[835.29px] h-[665.74px]" alt="Wave 1" />
          <img src="/images/cloud-1.svg" class="absolute left-[80px] top-[130px] w-[245px] h-auto" alt="Cloud 1" />
          <img src="/images/cloud-2.svg" class="absolute left-0 top-[260px] w-[230px] h-auto" alt="Cloud 2" />
          <img src="/images/cloud-3.svg" class="absolute left-[-152px] top-[400px] w-[260px] h-auto" alt="Cloud 3" />
          <img src="/images/cloud-4.svg" class="absolute left-[125px] top-[430px] w-[300px] h-auto" alt="Cloud 4" />
          <img src="/images/cloud-5.svg" class="absolute left-[100px] top-[580px] w-[290px] h-auto" alt="Cloud 5" />
        </div>
        <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div class="w-full lg:w-1/2 flex justify-center ml-[-30px] lg:ml-[-45px] mt-8 lg:mt-12 relative z-10">
            <img src="/images/pencil-about.svg" class="w-[280px] sm:w-[320px] lg:w-[362px] h-auto" alt="Survey Illustration" />
          </div>

          <div class="w-full lg:w-1/2 max-w-[650px] ml-[-30px] lg:ml-0">
            <h2 class="text-[28px] sm:text-[32px] lg:text-[40px] font-semibold text-[#04b0b1] leading-tight mb-6 text-center lg:text-right">
              Tentang E-survei
            </h2>
            <p class="text-[14px] sm:text-[15px] lg:text-[16px] text-[#04b0b1] leading-relaxed text-justify mb-8">
              SURVEI KEPUASAN MASYARAKAT (SKM) adalah data dan informasi tentang tingkat kepuasan masyarakat yang diperoleh dari hasil pengukuran secara kuantitatif dan kualitatif atas pendapat masyarakat dalam memperoleh pelayanan dari aparatur penyelenggara pelayanan publik. Survei Kepuasan Masyarakat merupakan tolok ukur untuk menilai tingkat kualitas pelayanan yang diberikan oleh Unit Pelayanan publik.
              <br /><br />
              Berdasarkan Permenpan No. 14 Tahun 2017, Survei Kepuasan Masyarakat adalah pengukuran secara komprehensif kegiatan tentang tingkat kepuasan masyarakat yang diperoleh dari hasil pengukuran atas pendapat masyarakat. Melalui survei ini diharapkan mendorong partisipasi masyarakat sebagai pengguna layanan dalam menilai kinerja penyelenggara pelayanan serta mendorong penyelenggara pelayanan publik untuk meningkatkan kualitas pelayanan dan melakukan pengembangan melalui inovasi-inovasi pelayanan publik.
            </p>
            <div class="flex justify-end relative z-10">
              <a href="/kategori-opd" class="flex items-center gap-2 px-6 py-3 bg-[#209fa0] text-white font-semibold text-sm rounded-2xl hover:bg-[#1a8485] transition-colors relative z-20">
                <img src="/images/img_heroiconsoutlinelogin.svg" class="w-5 h-5" alt="Login" />
                Mulai Survey
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>

    <section id="unsur" class="w-full px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-20 mt-16">
      <div class="text-center mb-12 relative">
        <h2 class="text-[28px] sm:text-[32px] lg:text-[40px] font-semibold text-[#04b0b1] leading-tight mb-6">
          Unsur Survei
        </h2>
        <p class="text-[14px] sm:text-[15px] lg:text-[16px] text-[#04b0b1] leading-relaxed max-w-4xl mx-auto relative">
          Kuesioner Survei Kepuasan Masyarakat disusun berdasarkan prinsip pelayanan sebagaimana telah ditetapkan dalam Peraturan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Republik Indonesia Nomor 14 Tahun 2017 tentang Pedoman Penyusunan Survei Kepuasan Masyarakat Unit Penyelenggara Pelayanan Publik terdiri dari pertanyaan yang mencangkup 9 (sembilan) unsur pelayanan
        </p>
        <img src="/images/cloud-6.svg" class="absolute right-[40px] top-[50px] w-[270px] h-auto" alt="Cloud 6" />
        <img src="/images/cloud-7.svg" class="absolute right-[-70px] top-[200px] w-[270px] h-auto" alt="Cloud 7" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 px-4 sm:px-8 lg:px-12 justify-items-center">
        <div class="relative w-[261px] h-[261px] overflow-visible rounded-xl custom-shadow">
          <div class="absolute inset-0 bg-[#00c8c9] border-2 border-[#00c8c9] rounded-xl z-0"></div>
          <img src="/images/card-unsur.svg" class="absolute top-[60px] left-1/2 transform -translate-x-[25.05%] h-auto z-10" style="width: 102.262% !important; max-width: 102.3% !important" alt="Card Unsur Decoration" />
          <div class="relative z-20 w-full h-full p-6 flex flex-col items-center justify-center text-center">
            <div class="mt-4"></div>
            <h3 class="text-white font-semibold text-sm mb-4">Persyaratan</h3>
            <img src="/images/img_wired_flat_56_d.png" class="w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] lg:w-[100px] lg:h-[100px] mb-6 card-image" alt="Requirements" />
            <button class="button-detail bg-white text-[#00c8c9] px-6 py-2 rounded-2xl text-sm font-semibold border-2 border-[#00C9CA]">
              Lihat Detail
            </button>
          </div>
        </div>
        <div class="relative w-[261px] h-[261px] rounded-xl custom-shadow">
            <div
              class="absolute inset-0 bg-[#00c8c9] border-2 border-[#00c8c9] rounded-xl z-0"
            ></div>
            <img
              src="/images/card-unsur.svg"
              class="absolute top-[60px] left-1/2 transform -translate-x-[24.95%] h-auto z-10"
              style="width: 102.6% !important; max-width: 103% !important"
              alt="Card Unsur Decoration"
            />
            <div
              class="relative z-20 w-full h-full p-6 flex flex-col items-center justify-center text-center"
            >
              <div class="mt-2"></div>
              <h3 class="text-white font-semibold text-sm mb-4 leading-tight">
                Sistem, Mekanisme,<br />dan Prosedur
              </h3>
              <img
                src="/images/img_operation_1.png"
                class="w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] lg:w-[106px] lg:h-[106px] mb-4 card-image"
                alt="System"
              />
              <button
                class="button-detail bg-white text-[#00c8c9] px-6 py-2 rounded-2xl text-sm font-semibold border-2 border-[#00C9CA]"
              >
                Lihat Detail
              </button>
            </div>
          </div>

          <div class="relative w-[261px] h-[261px] rounded-xl custom-shadow">
            <div
              class="absolute inset-0 bg-[#00c8c9] border-2 border-[#00c8c9] rounded-xl z-0"
            ></div>
            <img
              src="/images/card-unsur.svg"
              class="absolute top-[59px] left-1/2 transform -translate-x-[24.95%] h-auto z-10"
              style="width: 102.6% !important; max-width: 103% !important"
              alt="Card Unsur Decoration"
            />
            <div
              class="relative z-20 w-full h-full p-6 flex flex-col items-center justify-center text-center"
            >
              <div class="mt-4"></div>
              <h3 class="text-white font-semibold text-sm mb-4">
                Waktu Penyelesaian
              </h3>
              <img
                src="/images/img_wired_flat_45_c.png"
                class="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] lg:w-[116px] lg:h-[116px] mb-4 card-image"
                alt="Time"
              />
              <button
                class="button-detail bg-white text-[#00c8c9] px-6 py-2 rounded-2xl text-sm font-semibold border-2 border-[#00C9CA]"
              >
                Lihat Detail
              </button>
            </div>
          </div>

          <div class="relative w-[261px] h-[261px] rounded-xl custom-shadow">
            <div
              class="absolute inset-0 bg-[#00c8c9] border-2 border-[#00c8c9] rounded-xl z-0"
            ></div>
            <img
              src="/images/card-unsur.svg"
              class="absolute top-[60px] left-1/2 transform -translate-x-[25.05%] h-auto z-10"
              style="width: 102.2% !important; max-width: 103% !important"
              alt="Card Unsur Decoration"
            />
            <div
              class="relative z-20 w-full h-full p-6 flex flex-col items-center justify-center text-center"
            >
              <div class="mt-4"></div>
              <h3 class="text-white font-semibold text-sm mb-4">Biaya/Tarif</h3>
              <img
                src="/images/img_money_bag_1.png"
                class="w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] lg:w-[100px] lg:h-[100px] mb-6 card-image"
                alt="Cost"
              />
              <button
                class="button-detail bg-white text-[#00c8c9] px-6 py-2 rounded-2xl text-sm font-semibold border-2 border-[#00C9CA]"
              >
                Lihat Detail
              </button>
            </div>
          </div>

          <div class="relative w-[261px] h-[261px] rounded-xl custom-shadow">
            <div
              class="absolute inset-0 bg-[#00c8c9] border-2 border-[#00c8c9] rounded-xl z-0"
            ></div>
            <img
              src="/images/card-unsur.svg"
              class="absolute top-[60px] left-1/2 transform -translate-x-[25.05%] h-auto z-10"
              style="width: 102.262% !important; max-width: 103% !important"
              alt="Card Unsur Decoration"
            />
            <div
              class="relative z-20 w-full h-full p-6 flex flex-col items-center justify-center text-center"
            >
              <div class="mt-0"></div>
              <h3 class="text-white font-semibold text-sm mb-4 leading-tight">
                Produk Spesifikasi<br />dan Jenis Pelayanan
              </h3>
              <img
                src="/images/img_received_1.png"
                class="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] lg:w-[116px] lg:h-[116px] mb-4 card-image"
                alt="Product"
              />
              <button
                class="button-detail bg-white text-[#00c8c9] px-6 py-2 rounded-2xl text-sm font-semibold border-2 border-[#00C9CA]"
              >
                Lihat Detail
              </button>
            </div>
          </div>

          <div class="relative w-[261px] h-[261px] rounded-xl custom-shadow">
            <div
              class="absolute inset-0 bg-[#00c8c9] border-2 border-[#00c8c9] rounded-xl z-0"
            ></div>
            <img
              src="/images/card-unsur.svg"
              class="absolute top-[60px] left-1/2 transform -translate-x-[25.05%] h-auto z-10"
              style="width: 102.34% !important; max-width: 103% !important"
              alt="Card Unsur Decoration"
            />
            <div
              class="relative z-20 w-full h-full p-6 flex flex-col items-center justify-center text-center"
            >
              <div class="mt-4"></div>
              <h3 class="text-white font-semibold text-sm mb-4">
                Kompetensi Pelaksana
              </h3>
              <img
                src="/images/img_personal_growth.png"
                class="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] lg:w-[116px] lg:h-[116px] mb-4 card-image"
                alt="Competence"
              />
              <button
                class="button-detail bg-white text-[#00c8c9] px-6 py-2 rounded-2xl text-sm font-semibold border-2 border-[#00C9CA]"
              >
                Lihat Detail
              </button>
            </div>
          </div>

          <div class="relative w-[261px] h-[261px] rounded-xl custom-shadow">
            <div
              class="absolute inset-0 bg-[#00c8c9] border-2 border-[#00c8c9] rounded-xl z-0"
            ></div>
            <img
              src="/images/card-unsur.svg"
              class="absolute top-[60px] left-1/2 transform -translate-x-[25%] h-auto z-10"
              style="width: 102.5% !important; max-width: 105% !important"
              alt="Card Unsur Decoration"
            />
            <div
              class="relative z-20 w-full h-full p-6 flex flex-col items-center justify-center text-center"
            >
              <div class="mt-4"></div>
              <h3 class="text-white font-semibold text-sm mb-4">
                Perilaku Pelaksana
              </h3>
              <img
                src="/images/img_consumer_behavior.png"
                class="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] lg:w-[116px] lg:h-[116px] mb-4 card-image"
                alt="Behavior"
              />
              <button
                class="button-detail bg-white text-[#00c8c9] px-6 py-2 rounded-2xl text-sm font-semibold border-2 border-[#00C9CA]"
              >
                Lihat Detail
              </button>
            </div>
          </div>

          <div class="relative w-[261px] h-[261px] rounded-xl custom-shadow">
            <div
              class="absolute inset-0 bg-[#00c8c9] border-2 border-[#00c8c9] rounded-xl z-0"
            ></div>
            <img
              src="/images/card-unsur.svg"
              class="absolute top-[60px] left-1/2 transform -translate-x-[25.05%] h-auto z-10"
              style="width: 102.2% !important; max-width: 105% !important"
              alt="Card Unsur Decoration"
            />
            <div
              class="relative z-20 w-full h-full p-6 flex flex-col items-center justify-center text-center"
            >
              <div class="mt-0"></div>
              <h3 class="text-white font-semibold text-sm mb-4 leading-tight">
                Penanganan Pengaduan,<br />Saran, dan Masukan
              </h3>
              <img
                src="/images/img_recommendation_1.png"
                class="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] lg:w-[116px] lg:h-[116px] mb-4 card-image"
                alt="Complaint"
              />
              <button
                class="button-detail bg-white text-[#00c8c9] px-6 py-2 rounded-2xl text-sm font-semibold border-2 border-[#00C9CA]"
              >
                Lihat Detail
              </button>
            </div>
          </div>

      </div>
    </section>

    <section class="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
      <div class="text-center mb-16 relative">
        <h2 class="text-[28px] sm:text-[32px] lg:text-[40px] font-semibold text-[#00c8c9] leading-tight mb-6">
          Nilai Pelayanan OPD
        </h2>
        <p class="text-[14px] sm:text-[15px] lg:text-[16px] text-[#00c8c9] leading-relaxed max-w-4xl mx-auto">
          Nilai pelayanan OPD menggambarkan seberapa baik instansi pemerintah daerah memberikan layanan kepada masyarakat, sebagai dasar evaluasi kinerja dan peningkatan kualitas pelayanan publik.
        </p>
        <img src="/images/cloud-8.svg" class="absolute left-[-32px] top-[-120px] w-[250px] h-auto" alt="Cloud 8" />
        <img src="/images/cloud-9.svg" class="absolute right-[-30px] top-[30px] w-[270px] h-auto" alt="Cloud 9" />
      </div>

      <div class="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4">
        <canvas id="opdChart" class="w-full h-[250px] sm:h-[300px] lg:h-[350px]" role="img" aria-label="Chart representing OPD service ratings"></canvas>
      </div>
    </section>
  </div>

  <footer class="w-full relative">
    <img src="/images/Group Footer.svg" class="w-full min-w-[108vw] h-auto absolute bottom-0 left-[103%] -translate-x-1/2 -z-10" alt="Footer Background" />
    <div class="relative w-full max-w-[1280px] mx-auto px-8 pt-20 pb-12 sm:pt-24 lg:pt-28">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-8">
        <div class="lg:col-span-1 lg:ml-[-10px]">
          <h3 class="text-white font-semibold text-2xl mb-4">Hubungi Kami</h3>
          <div class="text-white/90 text-sm leading-relaxed">
            <p class="mb-2">Sekretariat Daerah Kabupaten Sidoarjo</p>
            <p class="mb-4">Bagian Organisasi</p>
            <p class="mb-4">
              Jl. Gubernur Suryo No.1, Gajah Timur, Magersari, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61212
            </p>
            <p class="mb-2">(031) 8921945</p>
            <p>organisasi@sidoarjokab.go.id</p>
          </div>
        </div>
        <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="md:ml-12">
            <h3 class="text-white font-semibold text-2xl mb-4">E-Survei</h3>
            <div class="text-white/90 text-sm leading-relaxed space-y-2">
              <p><a href="index.html" class="hover:text-white transition-colors">Home</a></p>
              <p><a href="index.html#tentang" class="hover:text-white transition-colors">Tentang E-SKM</a></p>
              <p><a href="index.html#unsur" class="hover:text-white transition-colors">Unsur Survei</a></p>
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
      <div class="mt-0 pt-6 border-t border-white/20 text-center">
        <p class="text-white text-[13px] sm:text-[14px] lg:text-[15px]">
          Copyright Kerja Praktek UMRAH 2025
        </p>
      </div>
    </div>
  </footer>
</template>

<style>
/* Style ini sengaja tidak dibuat 'scoped' agar dapat menargetkan 'body' 
  dan elemen lain persis seperti di file HTML asli.
*/
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