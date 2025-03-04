<template>
  <div class="splash-screen" :class="{ 'fade-out': isFading }">
    <div class="splash-content">
      <img src="/icons/yatrasangamlogo.png" alt="YatraSangam Logo" class="splash-logo" />
      <h1 class="splash-title">यात्रा संगम</h1>
      <p class="splash-tagline">Travel, Explore, Connect</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  duration: {
    type: Number,
    default: 3000 // Default 3 seconds
  }
});

const emit = defineEmits(['complete']);
const isFading = ref(false);

onMounted(() => {
  // Start the fade out after the specified duration
  setTimeout(() => {
    isFading.value = true;
    
    // Emit complete event after fade animation finishes
    setTimeout(() => {
      emit('complete');
    }, 500); // Match this with the CSS transition duration
  }, props.duration);
});
</script>

<style scoped>
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #4F46E5 0%, #7c3aed 100%);
  z-index: 9999;
  color: white;
  text-align: center;
  transition: opacity 0.5s ease-out;
}

.splash-screen.fade-out {
  opacity: 0;
  pointer-events: none;
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.splash-logo {
  width: 128px;
  height: 128px;
  object-fit: contain;
  border-radius: 16px;
  margin-bottom: 24px;
  animation: pulse 2s infinite;
}

.splash-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 10px;
  font-family: 'Hind', sans-serif;
  animation: fadeIn 0.8s ease-out;
}

.splash-tagline {
  font-size: 1.2rem;
  margin: 0;
  animation: fadeIn 0.8s ease-out 0.3s both;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 