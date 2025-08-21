<template>
  <div class="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 flex items-center justify-center">
    <!-- Outer circle -->
    <div class="absolute w-full h-full rounded-full border-4 border-white/30"></div>
    
    <!-- Progress circle -->
    <div 
      class="absolute w-full h-full rounded-full border-4 border-transparent"
      :style="{
        'background': `conic-gradient(
          #00c8c9 ${ratingPercentage}%, 
          transparent ${ratingPercentage}% 100%
        )`,
        'transform': 'rotate(-90deg)'
      }"
    ></div>
    
    <!-- Inner circle with rating -->
    <div class="absolute w-4/5 h-4/5 bg-white rounded-full flex flex-col items-center justify-center">
      <span class="text-2xl font-bold text-[#00c8c9]">{{ rating }}</span>
      <span class="text-xs text-gray-500">Dari 5</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  rating: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 5
  }
});

const ratingPercentage = computed(() => (props.rating / 5) * 100);
</script>
