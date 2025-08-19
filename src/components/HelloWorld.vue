<script setup>
import { ref, onMounted } from 'vue'

defineProps({
  msg: String
})

// State management (reactive variables)
const isVisible = ref(false)
const surveyStats = ref([
  { number: '50K+', label: 'Responden Aktif', icon: 'users' },
  { number: '1000+', label: 'Survey Selesai', icon: 'clipboard' },
  { number: '99%', label: 'Tingkat Kepuasan', icon: 'heart' }
])

const features = ref([
  {
    icon: 'zap',
    title: 'Super Cepat & Responsif',
    description: 'Survey dapat diselesaikan dalam hitungan menit dengan antarmuka yang intuitif dan responsif di semua perangkat.',
    gradient: 'from-emerald-500 to-green-600'
  },
  {
    icon: 'shield-check',
    title: 'Keamanan Terjamin',
    description: 'Data responden aman dengan enkripsi end-to-end dan compliance standar internasional untuk privasi maksimal.',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: 'bar-chart-3',
    title: 'Analytics Real-time',
    description: 'Dashboard analytics yang komprehensif memberikan insight mendalam tentang hasil survey secara real-time.',
    gradient: 'from-emerald-600 to-green-500'
  }
])

// Lifecycle hook for animations
onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

// Event Handlers
const handleStartSurvey = () => {
  alert('Terima kasih! Survey akan segera dimulai. Platform sedang dalam pengembangan.')
}

const handleLearnMore = () => {
  document.getElementById('features').scrollIntoView({ behavior: 'smooth' })
}

// Icon mapping utility
const getIconPath = (iconName) => {
  const icons = {
    'users': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
    'clipboard': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    'heart': 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
    'zap': 'M13 10V3L4 14h7v7l9-11h-7z',
    'shield-check': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    'bar-chart-3': 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z'
  }
  return icons[iconName] || icons['clipboard']
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 relative overflow-hidden">
    <div class="absolute inset-0 w-full h-full overflow-hidden z-0">
        <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="auroraGradient" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stop-color="#047857" />
                    <stop offset="50%" stop-color="#059669" />
                    <stop offset="100%" stop-color="#10b981" />
                </linearGradient>
            </defs>
            <path class="animate-aurora-1" d="M1920 0H960C720 150 800 300 960 450C1120 600 1280 650 1440 750C1600 850 1760 950 1920 1080V0Z" fill="url(#auroraGradient)" fill-opacity="0.3"/>
            <path class="animate-aurora-2" d="M1920 0H1100C950 200 1000 350 1150 500C1300 650 1400 700 1550 800C1700 900 1800 1000 1920 1080V0Z" fill="url(#auroraGradient)" fill-opacity="0.4"/>
            <path class="animate-aurora-3" d="M1920 0H1280C1180 250 1220 400 1350 550C1480 700 1580 750 1700 850C1820 950 1880 1020 1920 1080V0Z" fill="url(#auroraGradient)" fill-opacity="0.5"/>
        </svg>
    </div>

    <nav class="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/60 border-b border-white/30 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
              SurveyHub Pro
            </h1>
          </div>
          <div class="hidden md:flex items-center gap-8">
            <a href="#" class="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium relative group">
              Beranda <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a href="#features" @click.prevent="handleLearnMore" class="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium relative group">
              Fitur <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-200 group-hover:w-full"></span>
            </a>
            <button class="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200">
              Masuk
            </button>
          </div>
          <button class="md:hidden p-2 text-gray-600 hover:text-emerald-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>
    </nav>

    <section class="min-h-screen flex items-center justify-center px-6 pt-20 relative z-10">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="text-left space-y-8" :class="{ 'animate-fade-in-up': isVisible }">
          <div class="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-emerald-200 text-emerald-800 px-5 py-2.5 rounded-full shadow-sm">
            <div class="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span class="text-sm font-semibold tracking-wide">Platform Survey #1 Indonesia</span>
          </div>
          
          <div class="space-y-4">
            <h1 class="text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-none tracking-tight">
              {{ msg || 'Survey' }}
              <span class="block bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 bg-clip-text text-transparent">
                Masa Depan
              </span>
            </h1>
            <p class="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
              Berpartisipasilah dalam <strong class="text-emerald-600">survey interaktif</strong> yang akan membentuk masa depan yang lebih baik. 
            </p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <button @click="handleStartSurvey" class="group relative bg-gradient-to-r from-emerald-600 to-green-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
              <span class="relative z-10 flex items-center justify-center gap-3">
                Mulai Survey Gratis
                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </span>
            </button>
          </div>
          
          <div class="grid grid-cols-3 gap-6 pt-8">
            <div v-for="(stat, index) in surveyStats" :key="index" class="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:bg-white/90 hover:scale-105 hover:shadow-xl transition-all duration-300">
              <div class="flex items-center gap-3 mb-2">
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconPath(stat.icon)"/></svg>
                <div class="text-3xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                  {{ stat.number }}
                </div>
              </div>
              <div class="text-sm text-gray-600 font-medium">{{ stat.label }}</div>
            </div>
          </div>
        </div>
        
        <div class="relative hidden lg:block">
          <div class="relative flex justify-center items-center floating">
             <img src="https://storage.googleapis.com/gemini-prod-us-west1-assets/images/survey_hand_phone.png" alt="Ilustrasi tangan memegang smartphone dengan antarmuka survey" class="w-full max-w-lg drop-shadow-2xl">
          </div>
        </div>
      </div>
    </section>

    <section id="features" class="py-24 bg-white relative">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-20">
          <h2 class="text-5xl md:text-6xl font-black text-gray-900 mb-6">
            Mengapa Pilih <span class="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">SurveyHub Pro?</span>
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(feature, index) in features" :key="index" class="group relative bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:bg-white hover:border-emerald-200 hover:scale-105 hover:shadow-2xl transition-all duration-500">
            <div class="relative mb-6">
              <div :class="`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconPath(feature.icon)"/></svg>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-4 group-hover:text-emerald-700 transition-colors">{{ feature.title }}</h3>
            <p class="text-gray-600 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
    
    <footer class="bg-gray-900 text-white py-12 relative">
      <div class="container mx-auto px-6 text-center">
        <p>&copy; 2025 SurveyHub Pro. All rights reserved.</p>
        <p class="text-sm mt-1 text-gray-400">Made with <span class="text-red-400">❤️</span> in Indonesia</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Ensure smooth scrolling behavior */
html {
  scroll-behavior: smooth;
}

/* Custom Scrollbar */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #f1f5f9; }
::-webkit-scrollbar-thumb { background: linear-gradient(45deg, #10b981, #059669); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: linear-gradient(45deg, #059669, #047857); }

/* Enhanced Typography */
.font-black {
  font-weight: 900;
  letter-spacing: -0.025em;
}

/* New Aurora Wave Animations */
@keyframes aurora-flow-1 {
  0%, 100% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(-40px) translateY(20px); }
}
@keyframes aurora-flow-2 {
  0%, 100% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(30px) translateY(-15px); }
}
@keyframes aurora-flow-3 {
  0%, 100% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(-25px) translateY(25px); }
}

.animate-aurora-1 { animation: aurora-flow-1 18s ease-in-out infinite; }
.animate-aurora-2 { animation: aurora-flow-2 15s ease-in-out infinite; }
.animate-aurora-3 { animation: aurora-flow-3 12s ease-in-out infinite; }

/* General Floating Animation for Hero Image */
@keyframes floating {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
.floating {
  animation: floating 6s ease-in-out infinite;
}


/* Entry Animation */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

/* Glassmorphism Enhancement */
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Button Interaction Shine Effect */
button { position: relative; overflow: hidden; }
button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
button:hover::before { left: 100%; }

/* Focus States for Accessibility */
button:focus, a:focus {
  outline: 3px solid #34d399;
  outline-offset: 3px;
}

/* Responsive Font Size Adjustments */
@media (max-width: 768px) {
  .text-8xl { font-size: 4.5rem; }
  .text-7xl { font-size: 3.75rem; }
  .text-6xl { font-size: 3rem; }
}
</style>