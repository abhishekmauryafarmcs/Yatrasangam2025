<template>
  <div class="relative">
    <button 
      @click="toggleDropdown" 
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
      {{ currentLanguageName }}
    </button>

    <div 
      v-if="isOpen" 
      class="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
    >
      <button
        v-for="(lang, code) in languages"
        :key="code"
        @click="changeLanguage(code)"
        class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-150"
        :class="{ 'text-indigo-600 bg-gray-50': currentLanguage === code }"
      >
        {{ lang.name }}
        <span class="text-gray-400 text-xs ml-1">({{ lang.native }})</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const isOpen = ref(false)
const currentLanguage = ref(localStorage.getItem('preferredLanguage') || 'en')

const languages = {
  'en': { name: 'English', native: 'English' },
  'hi': { name: 'Hindi', native: 'हिंदी' },
  'bn': { name: 'Bengali', native: 'বাংলা' },
  'ta': { name: 'Tamil', native: 'தமிழ்' },
  'te': { name: 'Telugu', native: 'తెలుగు' },
  'mr': { name: 'Marathi', native: 'मराठी' },
  'gu': { name: 'Gujarati', native: 'ગુજરાતી' },
  'kn': { name: 'Kannada', native: 'ಕನ್ನಡ' },
  'ml': { name: 'Malayalam', native: 'മലയാളം' },
  'pa': { name: 'Punjabi', native: 'ਪੰਜਾਬੀ' }
}

const currentLanguageName = computed(() => {
  return languages[currentLanguage.value]?.native || 'English'
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const changeLanguage = async (langCode) => {
  currentLanguage.value = langCode
  localStorage.setItem('preferredLanguage', langCode)
  isOpen.value = false
  // Emit event for parent components
  emit('languageChanged', langCode)
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const emit = defineEmits(['languageChanged'])
</script> 