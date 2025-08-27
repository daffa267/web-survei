<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import Chart from 'chart.js/auto';

// --- START: Modal Logic (No changes) ---
const isModalVisible = ref(false);
const modalContent = ref({
  title: '',
  image: '',
  description: ''
});

const persyaratanContent = {
  title: 'Persyaratan',
  image: '/images/img_wired_flat_56_d.png',
  description: 'Syarat yang harus dipenuhi dalam pengurusan suatu jenis pelayanan, baik persyaratan teknis maupun administratif.'
};

const biayaTarifContent = {
  title: 'Biaya/Tarif',
  image: '/images/img_money_bag_1.png', 
  description: 'Ongkos yang dikenakan kepada penerima layanan dalam mengurus dan/atau memperoleh pelayanan dari penyelenggara yang besarnya ditetapkan berdasarkan kesepakatan antara penyelenggara dan masyarakat.'
};

const openModal = (content) => {
  modalContent.value = content;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};
// --- END: Modal Logic ---

// --- START: Chart Logic (No changes) ---

// Ref to hold the Chart.js instance
let opdChartInstance = null;

// Reactive state for selected filters
const selectedYear = ref('2023');
const activeDinas = ref(null); // null means top-level view

// Hierarchical survey data for different years
const surveyData = ref({
  '2023': [
    { name: 'Dinas Kesehatan', value: 2.1, opd: [{ name: 'Puskesmas Mekar Baru', value: 2.5 }, { name: 'Puskesmas Batu 10', value: 1.8 }, { name: 'Labkesda', value: 2.0 }, { name: 'Gudang Farmasi', value: 2.1 }] },
    { name: 'Dinas Kehutanan', value: 4.1, opd: [{ name: 'UPT Tahura', value: 4.2 }, { name: 'Bidang Konservasi', value: 4.0 }] },
    { name: 'Dinas Pertanian', value: 3.1, opd: [{ name: 'Bidang Tanaman Pangan', value: 3.3 }, { name: 'Bidang Peternakan', value: 2.9 }, { name: 'Balai Penyuluhan', value: 3.1 }] },
    { name: 'Dinas Perikanan', value: 2.1, opd: [{ name: 'UPT Pelabuhan Ikan', value: 2.0 }, { name: 'Seksi Budidaya', value: 2.2 }] },
    { name: 'Dinas Kepemudaan', value: 3.1, opd: [{ name: 'Bidang Olahraga', value: 3.5 }, { name: 'Bidang Pemuda', value: 2.8 }] },
    { name: 'Dinas Perhubungan', value: 3.8, opd: [{ name: 'Sektor Parkir', value: 3.9 }, { name: 'Sektor Transportasi Darat', value: 3.7 }] },
    { name: 'Dinas Luar', value: 4.5, opd: [{ name: 'Bagian Kerjasama Internasional', value: 4.6 }, { name: 'Bagian Protokol', value: 4.4 }] },
    { name: 'Dinas Dalam', value: 2.8, opd: [{ name: 'Seksi Kependudukan', value: 2.7 }, { name: 'Seksi Catatan Sipil', value: 2.9 }] },
    { name: 'Dinas Kelautan', value: 2.1, opd: [{ name: 'Bidang Pengawasan', value: 2.3 }, { name: 'Bidang Pemberdayaan Nelayan', value: 1.9 }] },
    { name: 'Diskominfo', value: 4.1, opd: [{ name: 'Bidang TIK', value: 4.5 }, { name: 'Bidang IKP', value: 3.9 }, { name: 'UPT Radio', value: 3.9 }] },
  ],
  '2024': [ // Sample data for 2024
    { name: 'Dinas Kesehatan', value: 2.3, opd: [{ name: 'Puskesmas Mekar Baru', value: 2.6 }, { name: 'Puskesmas Batu 10', value: 1.9 }, { name: 'Labkesda', value: 2.2 }] },
    { name: 'Dinas Kehutanan', value: 4.0, opd: [{ name: 'UPT Tahura', value: 4.1 }, { name: 'Bidang Konservasi', value: 3.9 }] },
    { name: 'Dinas Pertanian', value: 3.3, opd: [{ name: 'Bidang Tanaman Pangan', value: 3.4 }, { name: 'Bidang Peternakan', value: 3.2 }] },
    { name: 'Dinas Perhubungan', value: 3.9, opd: [{ name: 'Sektor Parkir', value: 4.0 }, { name: 'Sektor Transportasi Darat', value: 3.8 }] },
    { name: 'Diskominfo', value: 4.3, opd: [{ name: 'Bidang TIK', value: 4.6 }, { name: 'Bidang IKP', value: 4.1 }] },
  ],
  '2025': [ // Sample data for 2025
    { name: 'Dinas Kesehatan', value: 2.5, opd: [{ name: 'Puskesmas Mekar Baru', value: 2.8 }, { name: 'Puskesmas Batu 10', value: 2.2 }] },
    { name: 'Dinas Pertanian', value: 3.5, opd: [{ name: 'Bidang Tanaman Pangan', value: 3.6 }, { name: 'Bidang Peternakan', value: 3.4 }, { name: 'Balai Penyuluhan', value: 3.5 }] },
    { name: 'Dinas Perhubungan', value: 4.1, opd: [{ name: 'Sektor Parkir', value: 4.2 }, { name: 'Sektor Transportasi Darat', value: 4.0 }] },
    { name: 'Diskominfo', value: 4.4, opd: [{ name: 'Bidang TIK', value: 4.5 }, { name: 'Bidang IKP', value: 4.3 }] },
  ]
});

// Computed property to get the list of available agencies for the selected year
const availableDinas = computed(() => 
  surveyData.value[selectedYear.value]?.map(d => d.name) || []
);

// Computed property to determine the chart's title
const chartTitle = computed(() => {
    if (activeDinas.value) {
        return `Detail Nilai Pelayanan: ${activeDinas.value}`;
    }
    return `Nilai Pelayanan OPD Tahun ${selectedYear.value}`;
});

// Function to reset view to the top-level
const goBack = () => {
    activeDinas.value = null;
};

// Main function to update the chart based on current state
const updateChart = () => {
    if (!opdChartInstance) return;

    const dataForYear = surveyData.value[selectedYear.value];
    if (!dataForYear) return;

    let labels, data, backgroundColor, label;

    if (activeDinas.value) {
        // Drill-down view
        const dinasData = dataForYear.find(d => d.name === activeDinas.value);
        labels = dinasData?.opd?.map(o => o.name) || [];
        data = dinasData?.opd?.map(o => o.value) || [];
        label = `Rincian ${activeDinas.value}`;
        backgroundColor = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'];
    } else {
        // Top-level view
        labels = dataForYear.map(d => d.name);
        data = dataForYear.map(d => d.value);
        label = 'Nilai Pelayanan';
        backgroundColor = dataForYear.map((_, i) => i % 2 === 0 ? '#00a0a1' : '#00c8c9');
    }

    opdChartInstance.data.labels = labels;
    opdChartInstance.data.datasets[0].label = label;
    opdChartInstance.data.datasets[0].data = data;
    opdChartInstance.data.datasets[0].backgroundColor = backgroundColor;
    
    opdChartInstance.update();
};

// Watch for changes in filters and update the chart
watch([selectedYear, activeDinas], () => {
  // If year changes, reset to top-level view
  if (activeDinas.value && !availableDinas.value.includes(activeDinas.value)) {
      activeDinas.value = null;
  }
  updateChart();
});

// --- END: Chart Logic ---

onMounted(() => {
  // --- START: Existing Scroll/Nav Logic (Now for both Desktop & Mobile) ---
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
  const sections = document.querySelectorAll("section[id]");

  // Desktop Nav Elements
  const navItems = document.querySelectorAll(".nav-item");
  const indicator = document.getElementById("nav-indicator");
  
  // Mobile Nav Elements
  const mobileNavItems = document.querySelectorAll(".mobile-nav-item");
  const mobileIndicator = document.getElementById("mobile-nav-indicator");
  const mobileMenu = document.getElementById("mobileMenu");

  // Function to update DESKTOP nav indicator
  const updateNavIndicator = (activeItem) => {
    if (!indicator) return;
    navItems.forEach((item) => {
      // Reset all items to inactive state
      item.classList.remove("text-[#01c4c6]");
      item.classList.add("text-white");
      // Add shadow to all items initially with increased opacity
      const span = item.querySelector('span');
      if (span) {
        span.classList.add('drop-shadow-[0_2px_2px_rgba(0,0,0,0.37)]');
      }
    });
    
    if (activeItem) {
      // Set active item
      activeItem.classList.remove("text-white");
      activeItem.classList.add("text-[#01c4c6]");
      // Remove shadow from active item
      const activeSpan = activeItem.querySelector('span');
      if (activeSpan) {
        activeSpan.classList.remove('drop-shadow-[0_2px_2px_rgba(0,0,0,0.37)]');
      }
      
      indicator.style.width = `${activeItem.offsetWidth}px`;
      indicator.style.transform = `translateX(${activeItem.offsetLeft}px) translateY(calc(-50%))`;
    }
  };
  
  // NEW: Function to update MOBILE nav indicator
  const updateMobileNavIndicator = (activeItem) => {
    if (!activeItem || !mobileIndicator) return;
    mobileNavItems.forEach(item => item.classList.remove('active'));
    activeItem.classList.add('active');
    mobileIndicator.style.transform = `translateY(${activeItem.offsetTop}px)`;
  };
  
  // Function for scrolling to a section
  const scrollToSection = (navName) => {
      if (navName === "beranda") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const targetSection = document.getElementById(navName);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
      scrollTimeout = setTimeout(() => { isClickScrolling = false; }, 800);
  };

  // Click listener for DESKTOP nav items
  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const navName = this.getAttribute("data-nav");
      if (!navName) return;
      isClickScrolling = true;
      clearTimeout(scrollTimeout);
      updateNavIndicator(this);
      scrollToSection(navName);
    });
  });

  // NEW: Click listener for MOBILE nav items
  mobileNavItems.forEach((item) => {
    item.addEventListener("click", function (e) {
        e.preventDefault();
        const navName = this.getAttribute("data-nav");
        if (!navName) return;
        isClickScrolling = true;
        clearTimeout(scrollTimeout);
        updateMobileNavIndicator(this);
        scrollToSection(navName);
        // Close menu after a short delay to see the animation
        setTimeout(() => mobileMenu.classList.add("hidden"), 300);
    });
  });

  // MODIFIED: This function now updates BOTH desktop and mobile navs on scroll
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

    const activeDesktopItem = document.querySelector(`.nav-item[data-nav="${currentSectionId}"]`);
    updateNavIndicator(activeDesktopItem);

    const activeMobileItem = document.querySelector(`.mobile-nav-item[data-nav="${currentSectionId}"]`);
    updateMobileNavIndicator(activeMobileItem);
  };
  window.addEventListener("scroll", handleScrollNavUpdate);

  handleScroll();

  // MODIFIED: This now initializes BOTH nav indicators without animation on page load
  setTimeout(() => {
    if (indicator) indicator.style.transition = 'none';
    if (mobileIndicator) mobileIndicator.style.transition = 'none';

    handleScrollNavUpdate(); // Set initial position for both

    setTimeout(() => {
      if (indicator) indicator.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      if (mobileIndicator) mobileIndicator.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    }, 50);
  }, 100);
  
  // --- END: Scroll/Nav Logic ---


  // --- START: Chart Initialization (No changes) ---
  const ctx = document.getElementById("opdChart")?.getContext("2d");
  if (ctx && typeof Chart !== "undefined") {
    opdChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [], 
        datasets: [{
          label: "Nilai Pelayanan",
          data: [],
          backgroundColor: [],
          borderRadius: 4,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
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
        onClick: (event, elements) => {
            if (activeDinas.value || elements.length === 0) {
                return; 
            }
            const chartElement = elements[0];
            const index = chartElement.index;
            const dinasName = opdChartInstance.data.labels[index];
            const dinasData = surveyData.value[selectedYear.value].find(d => d.name === dinasName);

            if (dinasData && dinasData.opd && dinasData.opd.length > 0) {
                 activeDinas.value = dinasName;
            }
        }
      },
    });
    updateChart();
  } else {
    console.warn("Chart.js atau canvas tidak ditemukan.");
  }
  // --- END: Chart Initialization ---
});

const toggleMobileMenu = () => {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("hidden");
};
</script>

<template>
  <div class="content-wrapper mb-60">
    <header class="w-full pl-1 pr-4 sm:pl-2 sm:pr-6 lg:pl-4 lg:pr-8 py-1 sm:py-2 fixed top-0 left-0 z-50">
      <div class="flex flex-row justify-between items-center w-full max-w-[1280px] mx-auto">
        <div class="flex flex-row items-center gap-3 sm:gap-1">
          <img src="/images/logo esurvey.png" class="h-[80px] w-auto" alt="Logo Pemkot" />
          <div class="flex flex-col">
            <span class="text-[24px] font-semibold leading-tight custom-gradient-text">E-Survei</span>
            <span class="text-[16px] font-semibold leading-tight custom-gradient-text">Pemkot Tanjungpinang</span>
          </div>
        </div>

        <nav class="hidden lg:flex flex-row items-center gap-6 xl:gap-8 relative">
          <div id="nav-indicator" class="absolute left-0 top-1/2 h-10 bg-white rounded-full -z-10" style="transform-origin: center;"></div>
          <button class="px-4 py-2 relative z-10 text-white font-semibold text-sm hover:text-[#01c4c6] transition-colors nav-item" data-nav="beranda">
            <span class="drop-shadow-[0_2px_2px_rgba(0,0,0,0.37)]">Beranda</span>
          </button>
          <a href="#tentang" class="px-4 py-2 relative z-10 text-white font-semibold text-sm hover:text-[#01c4c6] transition-colors nav-item" data-nav="tentang">
            <span class="drop-shadow-[0_2px_2px_rgba(0,0,0,0.37)]">Tentang</span>
          </a>
          <a href="#unsur" class="px-4 py-2 relative z-10 text-white font-semibold text-sm hover:text-[#01c4c6] transition-colors nav-item" data-nav="unsur">
            <span class="drop-shadow-[0_2px_2px_rgba(0,0,0,0.37)]">Unsur Survei</span>
          </a>
          <router-link to="/kategori-opd" class="flex items-center justify-center gap-2 px-4 h-10 bg-[#209fa0] text-white font-semibold text-sm rounded-2xl hover:bg-[#1a8485] transition-colors">
            <img src="/images/img_heroiconsoutlinelogin.svg" class="w-5 h-5" alt="Login" />
            Mulai Survei
          </router-link>
        </nav>

        <button class="lg:hidden p-2 text-white" @click="toggleMobileMenu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div id="mobileMenu" class="hidden lg:hidden mt-4 pb-4 px-4">
        <div class="relative flex flex-col gap-2">
          <div id="mobile-nav-indicator" class="absolute left-0 w-full h-10 bg-[#01c4c6] rounded-2xl -z-10 transition-transform duration-400" style="transform: translateY(0px);"></div>
          
          <button data-nav="beranda" class="mobile-nav-item flex items-center gap-2 px-4 py-2 font-semibold text-sm text-left transition-colors z-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Beranda
          </button>
          <button data-nav="tentang" class="mobile-nav-item flex items-center gap-2 px-4 py-2 font-semibold text-sm text-left transition-colors z-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tentang
          </button>
          <button data-nav="unsur" class="mobile-nav-item flex items-center gap-2 px-4 py-2 font-semibold text-sm text-left transition-colors z-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Unsur Survei
          </button>

          <router-link to="/kategori-opd" class="flex items-center justify-center gap-2 px-4 py-2 mt-2 bg-[#209fa0] text-white font-semibold text-sm rounded-2xl w-fit">
            <img src="/images/img_heroiconsoutlinelogin.svg" class="w-5 h-5" alt="Login" />
            Mulai Survei
          </router-link>
        </div>
    </div>
    </header>

    <div class="relative">
      <div class="absolute top-0 right-0 w-full h-[1200px] z-0 pointer-events-none overflow-hidden hidden lg:block">
        <img src="/images/Line 2.svg" class="absolute top-0 right-0 w-[970.76px] h-[916px]" alt="Background Line 2" />
        <img src="/images/Line 3.svg" class="absolute top-[260px] right-[-150px] w-[530.12px] h-[441.59px] scale-125" alt="Background Line 3" />
        <img src="/images/Line 1.svg" class="absolute top-0 right-0 w-[886px] h-[651px]" alt="Background Line 1" />
      </div>

      <main class="relative w-full lg:min-h-[800px] flex items-center z-10 pt-32 pb-16 lg:pt-0 lg:pb-0">
        <div class="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:pl-4 lg:pr-8 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 lg:gap-4">
          
          <div class="flex flex-col w-full max-w-lg items-center text-center lg:items-start lg:text-left" data-aos="slide-from-far-left" data-aos-duration="1100" data-aos-easing="ease-out-cubic" data-aos-delay="400">
            <h1 class="text-[32px] sm:text-[40px] font-semibold text-[#04b0b1] leading-tight mb-6 max-w-md">
              Survei Kepuasan Masyarakat
            </h1>
            <p class="text-base text-[#04b0b1] leading-relaxed mb-8 text-justify">
              SURVEI KEPUASAN MASYARAKAT (SKM) adalah data dan informasi tentang tingkat kepuasan masyarakat yang diperoleh dari hasil pengukuran secara kuantitatif dan kualitatif atas pendapat masyarakat dalam memperoleh pelayanan dari aparatur penyelenggara pelayanan publik.
            </p>
            <a href="/kategori-opd" class="group flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-[#04b0b1] text-[#04b0b1] font-semibold text-sm rounded-2xl hover:bg-[#04b0b1] hover:text-white transition-all duration-300 w-fit">
              Mulai Survey
              <img src="/images/img_heroicons_outline_login_cyan_600.svg" class="w-5 h-5 group-hover:invert group-hover:brightness-0 group-hover:transition-all group-hover:duration-300" alt="Arrow" />
            </a>
          </div>
          
          <div class="relative w-full max-w-[320px] sm:max-w-[420px] lg:w-[486px] h-auto lg:mr-12 mt-8 lg:mt-0" data-aos="slide-from-far-right" data-aos-duration="800" data-aos-easing="ease-out-cubic">
            <img src="/images/Line 22.svg" 
                 class="absolute top-1/2 left-1/2 -translate-x-[calc(50%-63px)] -translate-y-[calc(50%-75px)]
                 w-[271px] h-[250px] 
                 sm:-translate-x-[calc(50%-80px)] sm:-translate-y-[calc(50%-97px)] sm:w-[340px] sm:h-[322px]
                 md:w-[380.28px] md:h-[360.91px]" 
                 alt="Phone Background"/>

            <img src="/images/Line 21.svg" 
                 class="absolute top-1/2 left-1/2 -translate-x-[calc(50%-62.5px)] -translate-y-[calc(50%-55px)]
                 w-[260px] h-[195px]
                 sm:-translate-x-[calc(50%-76.5px)] sm:-translate-y-[calc(50%-72.5px)] sm:w-[320px] sm:h-[240px]
                 md:w-[360.77px] md:h-[270.66px] scale-105" 
                 alt="Phone Background" />
  
            <img src="/images/hp dipegang 1.svg" 
                 class="relative z-10 w-full h-auto 
                 -translate-y-[5.7px] -translate-x
                 sm:-translate-y-[7.3px] sm:-translate-x-[14px]" 
                 alt="Phone Mockup" />
  
            <img src="/images/logo esurvey.png" 
                 class="absolute z-20 top-1/2 left-1/2 
                 h-[70px] -translate-x-[calc(50%-32.5px)] -translate-y-[calc(50%-4px)]
                 sm:h-[80px] sm:-translate-x-[calc(50%-24px)] sm:-translate-y-[calc(50%-8px)]
                 md:h-[90px] md:-translate-x-[calc(50%-28px)] md:-translate-y-[calc(50%-5px)] 
                 w-auto" 
                 alt="Logo on Phone" />
            </div>
        </div>

        <img src="/images/Group 3.svg" class="absolute left-0 top-[130px] w-[230px] h-auto z-20 hidden lg:block" alt="Decoration" />
        <img src="/images/Line 7.svg" class="absolute left-[0px] top-[270px] w-[180px] h-auto z-20 hidden lg:block" alt="Decoration" />
        <img src="/images/Group 4.svg" class="absolute left-[70px] top-[430px] w-[270px] h-auto z-20 hidden lg:block" alt="Decoration" />
      </main>

      <section id="tentang" class="relative w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 mt-0 lg:mt-16">
        <div class="absolute inset-0 z-0 overflow-visible hidden md:block">
          <img src="/images/wave-1.svg" class="absolute left-[-108px] top-[286px] w-[835.29px] h-[665.74px]" alt="Wave 1" />
          <img src="/images/cloud-1.svg" class="absolute left-[80px] top-[130px] w-[245px] h-auto" alt="Cloud 1" />
          <img src="/images/cloud-2.svg" class="absolute left-0 top-[260px] w-[230px] h-auto" alt="Cloud 2" />
          <img src="/images/cloud-3.svg" class="absolute left-[-152px] top-[400px] w-[260px] h-auto" alt="Cloud 3" />
          <img src="/images/cloud-4.svg" class="absolute left-[125px] top-[430px] w-[300px] h-auto" alt="Cloud 4" />
          <img src="/images/cloud-5.svg" class="absolute left-[100px] top-[580px] w-[290px] h-auto" alt="Cloud 5" />
        </div>
        <div class="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-12 max-w-6xl mx-auto" style="--section-shift: 3rem;">
          <div class="w-full lg:w-1/2 flex justify-center order-last lg:order-first -mt-4 lg:mt-12 lg:-translate-x-[var(--section-shift)]" data-aos="zoom-in" data-aos-duration="1000">
            <img src="/images/pencil-about.svg" class="w-[280px] sm:w-[320px] lg:w-[362px] h-auto" alt="Survey Illustration" />
          </div>

          <div class="w-full lg:w-1/2 lg:translate-x-[var(--section-shift)]" data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="200">
            <h2 class="text-[28px] sm:text-[32px] lg:text-[40px] font-semibold text-[#04b0b1] leading-tight mb-6 text-center lg:text-left">
              Tentang E-survei
            </h2>
            <p class="text-base text-[#04b0b1] leading-relaxed text-justify">
              SURVEI KEPUASAN MASYARAKAT (SKM) adalah data dan informasi tentang tingkat kepuasan masyarakat yang diperoleh dari hasil pengukuran secara kuantitatif dan kualitatif atas pendapat masyarakat dalam memperoleh pelayanan dari aparatur penyelenggara pelayanan publik. Survei Kepuasan Masyarakat merupakan tolok ukur untuk menilai tingkat kualitas pelayanan yang diberikan oleh Unit Pelayanan publik.
              <br /><br />
              Berdasarkan Permenpan No. 14 Tahun 2017, Survei Kepuasan Masyarakat adalah pengukuran secara komprehensif kegiatan tentang tingkat kepuasan masyarakat yang diperoleh dari hasil pengukuran atas pendapat masyarakat. Melalui survei ini diharapkan mendorong partisipasi masyarakat sebagai pengguna layanan dalam menilai kinerja penyelenggara pelayanan serta mendorong penyelenggara pelayanan publik untuk meningkatkan kualitas pelayanan dan melakukan pengembangan melalui inovasi-inovasi pelayanan publik.
            </p>
            <div class="flex justify-center lg:justify-start mt-6">
              <a href="/kategori-opd" class="flex items-center gap-2 px-6 py-3 bg-[#209fa0] text-white font-semibold text-sm rounded-2xl hover:bg-[#1a8485] transition-colors">
                <img src="/images/img_heroiconsoutlinelogin.svg" class="w-5 h-5" alt="Login" />
                Mulai Survey
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>

    <section id="unsur" class="w-full px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-20 lg:pt-24 lg:pb-20">
      <div class="text-center mb-12 relative max-w-4xl mx-auto" data-aos="zoom-in-up" data-aos-duration="600">
        <h2 class="text-[28px] sm:text-[32px] lg:text-[40px] font-semibold text-[#04b0b1] leading-tight mb-6">
          Unsur Survei
        </h2>
        <p class="text-base text-[#04b0b1] leading-relaxed">
          Kuesioner Survei Kepuasan Masyarakat disusun berdasarkan prinsip pelayanan sebagaimana telah ditetapkan dalam Peraturan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Republik Indonesia Nomor 14 Tahun 2017 tentang Pedoman Penyusunan Survei Kepuasan Masyarakat Unit Penyelenggara Pelayanan Publik terdiri dari pertanyaan yang mencangkup 9 (sembilan) unsur pelayanan
        </p>
        <img src="/images/cloud-6.svg" class="absolute right-[-80px] top-[50px] w-[270px] h-auto hidden md:block" alt="Cloud 6" />
        <img src="/images/cloud-7.svg" class="absolute right-[-120px] top-[200px] w-[270px] h-auto hidden md:block" alt="Cloud 7" />
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 lg:gap-y-10 lg:gap-x-4 mb-16 max-w-7xl mx-auto justify-items-center">
        
        <div class="relative overflow-visible rounded-xl custom-shadow h-[188px] w-[170px] sm:h-[200px] sm:w-[200px] lg:h-[259px] lg:w-[260px]" data-aos="fade-up" data-aos-duration="500" data-aos-delay="100" data-aos-once="true">
          <div class="absolute inset-0 rounded-[8px] sm:rounded-[10px] z-0" style="background: linear-gradient(90deg, #f2fffc 25%, rgba(57, 211, 211, 0.748) 100%) !important;"></div>
          <img src="/images/card-unsur.svg" class="absolute top-[30.4%] sm:top-[23%] left-1/2 transform -translate-x-[24.93%] h-auto z-10" style="width: 102.6% !important; max-width: 103% !important" alt="Card Unsur Decoration" />
          <div class="relative z-20 w-full h-full p-4 flex flex-col items-center lg:justify-between">
            <div class="w-full flex-1 flex flex-col items-center justify-center pb-10 lg:pb-0">
              <h3 class="text-[#209fa0] font-bold text-sm mb-6 text-center">Persyaratan</h3>
              <img src="/images/img_wired_flat_56_d.png" class="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] lg:w-[90px] lg:h-[90px] mb-6 card-image" alt="Requirements" />
            </div>
            <button @click="openModal(persyaratanContent)" class="button-detail bg-white text-[#00c8c9] px-5 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold border-2 border-[#00C9CA] w-full max-w-[120px] absolute bottom-4 left-[85%] -translate-x-1/2 lg:relative lg:left-[53%] lg:-translate-x-1/2 lg:mx-0">
              Lihat Detail
            </button>
          </div>
        </div>

        <div class="relative overflow-visible rounded-xl custom-shadow h-[188px] w-[170px] sm:h-[200px] sm:w-[200px] lg:h-[259px] lg:w-[260px]" data-aos="fade-up" data-aos-duration="500" data-aos-delay="200" data-aos-once="true">
            <div class="absolute inset-0 rounded-[8px] sm:rounded-[10px] z-0" style="background: linear-gradient(90deg, #f2fffc 25%, rgba(57, 211, 211, 0.748) 100%) !important;"></div>
            <img src="/images/card-unsur.svg" class="absolute top-[30.4%] sm:top-[23%] left-1/2 transform -translate-x-[24.93%] h-auto z-10" style="width: 102.6% !important; max-width: 103% !important" alt="Card Unsur Decoration" />
            <div class="relative z-20 w-full h-full p-4 flex flex-col items-center lg:justify-between">
              <div class="w-full flex-1 flex flex-col items-center justify-center pb-10 lg:pb-0">
                <h3 class="text-[#209fa0] font-bold text-xs sm:text-sm mb-4 leading-tight text-center">
                  Sistem, Mekanisme,<br />dan Prosedur
                </h3>
                <img src="/images/img_operation_1.png" class="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] lg:w-[100px] lg:h-[100px] mb-6 card-image" alt="System" />
              </div>
              <button class="button-detail bg-white text-[#00c8c9] px-5 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold border-2 border-[#00C9CA] w-full max-w-[120px] absolute bottom-4 left-[85%] -translate-x-1/2 lg:relative lg:left-[53%] lg:-translate-x-1/2 lg:mx-0">
                Lihat Detail
              </button>
            </div>
        </div>

        <div class="relative overflow-visible rounded-xl custom-shadow h-[188px] w-[170px] sm:h-[200px] sm:w-[200px] lg:h-[259px] lg:w-[260px]" data-aos="fade-up" data-aos-duration="500" data-aos-delay="300" data-aos-once="true">
            <div class="absolute inset-0 rounded-[8px] sm:rounded-[10px] z-0" style="background: linear-gradient(90deg, #f2fffc 25%, rgba(57, 211, 211, 0.748) 100%) !important;"></div>
            <img src="/images/card-unsur.svg" class="absolute top-[30.4%] sm:top-[23%] left-1/2 transform -translate-x-[24.97%] h-auto z-10" style="width: 102.4% !important; max-width: 103% !important" alt="Card Unsur Decoration" />
            <div class="relative z-20 w-full h-full p-4 flex flex-col items-center lg:justify-between">
              <div class="w-full flex-1 flex flex-col items-center justify-center pb-10 lg:pb-0">
                <h3 class="text-[#209fa0] font-bold text-sm mb-4 text-center">
                  Waktu Penyelesaian
                </h3>
                <img src="/images/img_wired_flat_45_c.png" class="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] lg:w-[105px] lg:h-[105px] mb-4 card-image" alt="Time" />
              </div>
              <button class="button-detail bg-white text-[#00c8c9] px-5 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold border-2 border-[#00C9CA] w-full max-w-[120px] absolute bottom-4 left-[85%] -translate-x-1/2 lg:relative lg:left-[53%] lg:-translate-x-1/2 lg:mx-0">
                Lihat Detail
              </button>
            </div>
        </div>

        <div class="relative overflow-visible rounded-xl custom-shadow h-[188px] w-[170px] sm:h-[200px] sm:w-[200px] lg:h-[259px] lg:w-[260px]" data-aos="fade-up" data-aos-duration="500" data-aos-delay="400" data-aos-once="true">
            <div class="absolute inset-0 rounded-[8px] sm:rounded-[10px] z-0" style="background: linear-gradient(90deg, #f2fffc 25%, rgba(57, 211, 211, 0.748) 100%) !important;"></div>
            <img src="/images/card-unsur.svg" class="absolute top-[30.4%] sm:top-[23%] left-1/2 transform -translate-x-[24.93%] h-auto z-10" style="width: 102.6% !important; max-width: 103% !important" alt="Card Unsur Decoration" />
            <div class="relative z-20 w-full h-full p-4 flex flex-col items-center lg:justify-between">
              <div class="w-full flex-1 flex flex-col items-center justify-center pb-10 lg:pb-0">
                <h3 class="text-[#209fa0] font-bold text-sm mb-6 text-center">Biaya/Tarif</h3>
                <img src="/images/img_money_bag_1.png" class="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] lg:w-[90px] lg:h-[90px] mb-6 card-image" alt="Cost" />
              </div>
              <button @click="openModal(biayaTarifContent)" class="button-detail bg-white text-[#00c8c9] px-5 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold border-2 border-[#00C9CA] w-full max-w-[120px] absolute bottom-4 left-[85%] -translate-x-1/2 lg:relative lg:left-[53%] lg:-translate-x-1/2 lg:mx-0">
                Lihat Detail
              </button>
            </div>
        </div>

        <div class="relative overflow-visible rounded-xl custom-shadow h-[188px] w-[170px] sm:h-[200px] sm:w-[200px] lg:h-[259px] lg:w-[260px]" data-aos="fade-up" data-aos-duration="500" data-aos-delay="400" data-aos-once="true">
            <div class="absolute inset-0 rounded-[8px] sm:rounded-[10px] z-0" style="background: linear-gradient(90deg, #f2fffc 25%, rgba(57, 211, 211, 0.748) 100%) !important;"></div>
            <img src="/images/card-unsur.svg" class="absolute top-[30.4%] sm:top-[23%] left-1/2 transform -translate-x-[24.95%] h-auto z-10" style="width: 102.5% !important; max-width: 103% !important" alt="Card Unsur Decoration" />
            <div class="relative z-20 w-full h-full p-4 flex flex-col items-center lg:justify-between">
              <div class="w-full flex-1 flex flex-col items-center justify-center pb-10 lg:pb-0">
                <h3 class="text-[#209fa0] font-bold text-xs sm:text-sm mb-6 leading-tight text-center">
                  Produk Spesifikasi<br />dan Jenis Pelayanan
                </h3>
                <img src="/images/img_received_1.png" class="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] lg:w-[105px] lg:h-[105px] mb-6 card-image" alt="Product" />
              </div>
              <button class="button-detail bg-white text-[#00c8c9] px-5 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold border-2 border-[#00C9CA] w-full max-w-[120px] absolute bottom-4 left-[85%] -translate-x-1/2 lg:relative lg:left-[53%] lg:-translate-x-1/2 lg:mx-0">
                Lihat Detail
              </button>
            </div>
        </div>

        <div class="relative overflow-visible rounded-xl custom-shadow h-[188px] w-[170px] sm:h-[200px] sm:w-[200px] lg:h-[259px] lg:w-[260px]" data-aos="fade-up" data-aos-duration="500" data-aos-delay="500" data-aos-once="true">
            <div class="absolute inset-0 rounded-[8px] sm:rounded-[10px] z-0" style="background: linear-gradient(90deg, #f2fffc 25%, rgba(57, 211, 211, 0.748) 100%) !important;"></div>
            <img src="/images/card-unsur.svg" class="absolute top-[30.4%] sm:top-[23%] left-1/2 transform -translate-x-[24.93%] h-auto z-10" style="width: 102.6% !important; max-width: 103% !important" alt="Card Unsur Decoration" />
            <div class="relative z-20 w-full h-full p-4 flex flex-col items-center lg:justify-between">
              <div class="w-full flex-1 flex flex-col items-center justify-center pb-10 lg:pb-0">
                <h3 class="text-[#209fa0] font-bold text-xs sm:text-sm mb-4 sm:mb-4 -mt-1 sm:mt-0 leading-tight text-center">
                  Kompetensi Pelaksana
                </h3>
                <img src="/images/img_personal_growth.png" class="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] lg:w-[105px] lg:h-[105px] -mb-2 sm:mb-6 card-image" alt="Competence" />
              </div>
              <button class="button-detail bg-white text-[#00c8c9] px-5 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold border-2 border-[#00C9CA] w-full max-w-[120px] absolute bottom-4 left-[85%] -translate-x-1/2 lg:relative lg:left-[53%] lg:-translate-x-1/2 lg:mx-0">
                Lihat Detail
              </button>
            </div>
        </div>
        
        <div class="relative overflow-visible rounded-xl custom-shadow h-[188px] w-[170px] sm:h-[200px] sm:w-[200px] lg:h-[259px] lg:w-[260px]" data-aos="fade-up" data-aos-duration="500" data-aos-delay="600" data-aos-once="true">
            <div class="absolute inset-0 rounded-[8px] sm:rounded-[10px] z-0" style="background: linear-gradient(90deg, #f2fffc 25%, rgba(57, 211, 211, 0.748) 100%) !important;"></div>
            <img src="/images/card-unsur.svg" class="absolute top-[30.4%] sm:top-[23%] left-1/2 transform -translate-x-[24.93%] h-auto z-10" style="width: 102.6% !important; max-width: 103% !important" alt="Card Unsur Decoration" />
            <div class="relative z-20 w-full h-full p-4 flex flex-col items-center lg:justify-between">
              <div class="w-full flex-1 flex flex-col items-center justify-center pb-10 lg:pb-0">
                <h3 class="text-[#209fa0] font-bold text-sm mb-4 text-center">
                  Perilaku Pelaksana
                </h3>
                <img src="/images/img_consumer_behavior.png" class="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] lg:w-[105px] lg:h-[105px] mb-4 card-image" alt="Behavior" />
              </div>
              <button class="button-detail bg-white text-[#00c8c9] px-5 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold border-2 border-[#00C9CA] w-full max-w-[120px] absolute bottom-4 left-[85%] -translate-x-1/2 lg:relative lg:left-[53%] lg:-translate-x-1/2 lg:mx-0">
                Lihat Detail
              </button>
            </div>
        </div>
        
        <div class="relative overflow-visible rounded-xl custom-shadow h-[188px] w-[170px] sm:h-[200px] sm:w-[200px] lg:h-[259px] lg:w-[260px]" data-aos="fade-up" data-aos-duration="500" data-aos-delay="700" data-aos-once="true">
            <div class="absolute inset-0 rounded-[8px] sm:rounded-[10px] z-0" style="background: linear-gradient(90deg, #f2fffc 25%, rgba(57, 211, 211, 0.748) 100%) !important;"></div>
            <img src="/images/card-unsur.svg" class="absolute top-[30.4%] sm:top-[23%] left-1/2 transform -translate-x-[24.93%] h-auto z-10" style="width: 102.6% !important; max-width: 103% !important" alt="Card Unsur Decoration" />
            <div class="relative z-20 w-full h-full p-4 flex flex-col items-center lg:justify-between">
              <div class="w-full flex-1 flex flex-col items-center justify-start pt-0 pb-4 sm:py-0 sm:justify-center lg:pb-0">
                <h3 class="text-[#209fa0] font-bold text-xs sm:text-sm mb-1 sm:mb-4 -mt-1 sm:mt-0 leading-tight text-center">
                  Penanganan Pengaduan,<br />Saran, dan Masukan
                </h3>
                <img src="/images/img_recommendation_1.png" class="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] lg:w-[105px] lg:h-[105px] mb-0 sm:mb-6 card-image" alt="Complaint" />
              </div>
              <button class="button-detail bg-white text-[#00c8c9] px-5 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold border-2 border-[#00C9CA] w-full max-w-[120px] absolute bottom-4 left-[85%] -translate-x-1/2 lg:relative lg:left-[53%] lg:-translate-x-1/2 lg:mx-0">
                Lihat Detail
              </button>
            </div>
        </div>
      </div>
    </section>

    <section class="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
      <div class="text-center mb-12 sm:mb-16 relative max-w-4xl mx-auto">
        <h2 class="text-[28px] sm:text-[32px] lg:text-[40px] font-semibold text-[#00c8c9] leading-tight mb-6">
          Nilai Pelayanan OPD
        </h2>
        <p class="text-base text-[#00c8c9] leading-relaxed">
          Nilai pelayanan OPD menggambarkan seberapa baik instansi pemerintah daerah memberikan layanan kepada masyarakat, sebagai dasar evaluasi kinerja dan peningkatan kualitas pelayanan publik.
        </p>
        <img src="/images/cloud-8.svg" class="absolute left-[-60px] top-[-120px] w-[250px] h-auto hidden md:block" alt="Cloud 8" />
        <img src="/images/cloud-9.svg" class="absolute right-[-60px] top-[30px] w-[270px] h-auto hidden md:block" alt="Cloud 9" />
      </div>

      <div class="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6">
         <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h3 class="text-lg sm:text-xl font-semibold text-[#007c7e] text-center sm:text-left order-2 sm:order-1">
                {{ chartTitle }}
            </h3>
            <div class="flex items-center gap-2 sm:gap-3 order-1 sm:order-2">
                <button 
                    v-if="activeDinas" 
                    @click="goBack"
                    class="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-300 transition-colors"
                >
                    &larr; Kembali
                </button>
                <select v-model="selectedYear" class="dropdown-style">
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                </select>
                <select v-model="activeDinas" class="dropdown-style">
                    <option :value="null">Semua Dinas</option>
                    <option v-for="dinas in availableDinas" :key="dinas" :value="dinas">
                        {{ dinas }}
                    </option>
                </select>
            </div>
        </div>
        <div class="w-full h-[300px] sm:h-[400px] lg:h-[450px]">
          <canvas id="opdChart" role="img" :aria-label="chartTitle"></canvas>
        </div>
      </div>
    </section>
    </div>

  <div v-if="isModalVisible" @click="closeModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
    <div @click.stop class="relative bg-[#00c8c9] text-white rounded-2xl shadow-lg w-11/12 max-w-2xl p-8 transform transition-all duration-300 scale-95 opacity-0" :class="{ 'scale-100 opacity-100': isModalVisible }">
      <button @click="closeModal" class="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors z-10">
        <i class="fa-solid fa-times text-[#00c8c9]"></i>
      </button>
      
      <h2 class="text-3xl font-bold mb-6 text-center">{{ modalContent.title }}</h2>
      <img :src="modalContent.image" class="w-32 h-32 mx-auto mb-8 card-image" alt="Modal Icon" />
      <p class="text-base leading-relaxed text-justify">
        {{ modalContent.description }}
      </p>
    </div>
  </div>
  
  <footer class="w-full relative">
    <img src="/images/Group Footer.svg" class="w-[150vw] h-[120%] sm:h-auto sm:w-auto sm:min-w-[108vw] absolute bottom-0 -right-0 sm:-right-10 -z-10 object-cover" alt="Footer Background" />
    <div class="relative w-full max-w-[1280px] mx-auto px-8 pt-20 pb-6 sm:pt-24 lg:pt-28">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-8">
            <div class="lg:col-span-1 lg:ml-[-10px]">
                <h3 class="text-white font-semibold text-2xl mb-4">Hubungi Kami</h3>
                <div class="text-white/90 text-sm leading-relaxed">
                    <p class="mb-2">Dinas Komunikasi dan Informatika Kota Tanjungpinang</p>
                    <p class="mb-4">
                        Jl. Daeng Celak, Gedung C Lantai 1 & 2, Senggarang, Kecamatan Tanjungpinang Kota, Tanjungpinang, Kepulauan Riau 29111
                    </p>
                    <p class="mb-2">(031) 12345678</p>
                    <p>kominfo@tanjungpinangkota.go.id</p>
                </div>
            </div>
            <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="md:ml-12">
                    <h3 class="text-white font-semibold text-2xl mb-4">E-Survei</h3>
                    <div class="text-white/90 text-sm leading-relaxed space-y-2">
                        <p><a href="/" class="hover:text-white transition-colors">Home</a></p>
                        <p><a href="/#tentang" class="hover:text-white transition-colors">Tentang</a></p>
                        <p><a href="/#unsur" class="hover:text-white transition-colors">Unsur Survei</a></p>
                    </div>

                    <div class="mt-6 pt-4 border-t border-white/20">
                        <router-link to="/login" class="group relative inline-flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-sm border border-white/40 rounded-xl text-white font-bold text-sm overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-white/10 hover:border-white/60">
                            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            
                            <div class="relative p-1.5 bg-gradient-to-br from-white/30 to-white/10 rounded-lg transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            
                            <span class="relative z-10">
                                Portal Admin
                            </span>
                            
                            <div class="relative ml-2 group-hover:translate-x-1.5 transition-transform duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </router-link>
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
        <div class="mt-0 pt-8 text-center">
            <p class="text-white text-[13px] sm:text-[14px] lg:text-[15px]">
                Copyright Kerja Praktek UMRAH 2025
            </p>
        </div>
    </div>
  </footer>
</template>

<style>
::placeholder {
  color: rgba(255, 255, 255, 0.8) !important;
}

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

.mobile-nav-item {
  color: #01c4c6; /* Warna teks saat tidak aktif */
}

.mobile-nav-item.active {
  color: white; /* Warna teks saat aktif */
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

/* Added for modal transition */
.scale-95 {
  transform: scale(0.95);
}
.opacity-0 {
  opacity: 0;
}
.scale-100 {
  transform: scale(1);
}
.opacity-100 {
  opacity: 1;
}

/* Added for Dropdown styling */
.dropdown-style {
    border: 1px solid #00c8c9;
    border-radius: 8px;
    padding: 6px 10px;
    color: #007c7e;
    font-weight: 500;
    font-size: 14px;
    background-color: #f2fffc;
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300c8c9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1.2em;
    padding-right: 2rem;
}

.dropdown-style:focus {
    outline: none;
    border-color: #007c7e;
    box-shadow: 0 0 0 2px rgba(0, 192, 201, 0.3);
}

[data-aos="slide-from-far-left"] {
  transform: translateX(-128%);
  opacity: 0;
  transition-property: transform, opacity;
  transition-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: transform, opacity;
}

[data-aos="slide-from-far-left"].aos-animate {
  transform: translateX(0);
  opacity: 1;
}

[data-aos="slide-from-far-right"] {
  transform: translateX(128%);
  opacity: 0;
  transition-property: transform, opacity;
  transition-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: transform, opacity;
}

[data-aos="slide-from-far-right"].aos-animate {
  transform: translateX(0);
  opacity: 1;
}

@media (max-width: 1023px) {
  .content-wrapper > header {
    background: linear-gradient(
      90deg,
      #f2fffc 25%,
      rgba(57, 211, 211, 0.748) 100%
    ) !important;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07);
  }
}

.login-btn-glow {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
}
.login-btn-glow:hover {
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
}
.gradient-border {
    background: linear-gradient(45deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4));
    padding: 2px;
    border-radius: 9999px;
}
.gradient-border-inner {
    background: rgba(0, 117, 118, 0.9);
    border-radius: 9999px;
    transition: all 0.3s ease;
}
.gradient-border:hover .gradient-border-inner {
    background: rgba(255, 255, 255, 0.1);
}

</style>