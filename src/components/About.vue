<script setup>
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <nav class="bg-blue-600 text-white py-4 px-8 flex justify-between items-center">
      <h1 class="text-2xl font-bold">MyVueSite</h1>
      <ul class="flex gap-6">
        <li><router-link to="/" class="hover:underline">Home</router-link></li>
        <li><router-link to="/about" class="hover:underline">About</router-link></li>
      </ul>
    </nav>

    <!-- Content -->
    <section class="flex-1 flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h2 class="text-4xl font-bold text-gray-600 mb-4">About Page</h2>
      <p class="text-gray-600 max-w-xl">
        Ini adalah halaman About.  
        Kamu sekarang berhasil navigasi dari Home ke About!
      </p>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white text-center py-4">
      &copy; 2025 MyVueSite. All rights reserved.
    </footer>
  </div>
</template>

<style scoped>
</style>
