<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900">Indian Cultural Tips & Etiquette Guide</h1>
      <p class="mt-2 text-lg text-gray-600">Understand and respect local customs to enhance your cultural journey across India</p>
    </div>

    <!-- Region Selection with Tabs -->
    <div class="mt-8">
      <div class="sm:hidden">
        <label for="region" class="sr-only">Select a region</label>
        <select 
          id="region" 
          v-model="selectedRegion" 
          class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option v-for="region in regions" :key="region" :value="region">{{ region }}</option>
        </select>
      </div>
      <div class="hidden sm:block">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              v-for="region in regions"
              :key="region"
              @click="selectedRegion = region"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              :class="selectedRegion === region ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              {{ region }}
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Cultural Information Content -->
    <div class="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
      <!-- Category Tabs -->
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex flex-wrap" aria-label="Tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="py-4 px-6 text-center border-b-2 font-medium text-sm md:text-base"
            :class="activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            <span class="inline-block mr-2">{{ tab.icon }}</span>
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- Essential Phrases Tab -->
        <div v-if="activeTab === 'phrases'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-semibold text-gray-900">Essential Hindi Phrases for {{ selectedRegion }}</h3>
            <button class="btn-secondary text-sm flex items-center">
              <span class="mr-1">🔊</span> Listen to Pronunciation
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="(phrase, index) in culturalInfo[selectedRegion].phrases" :key="index" 
                class="bg-gray-50 p-4 rounded-lg hover:bg-indigo-50 transition-colors duration-200 cursor-pointer">
              <p class="text-sm font-medium text-gray-500">{{ phrase.english }}</p>
              <p class="mt-1 text-lg font-bold text-indigo-600">{{ phrase.native }}</p>
              <p class="mt-1 text-xs text-gray-500">{{ phrase.pronunciation }}</p>
              <button class="mt-2 text-sm text-indigo-600 hover:text-indigo-800">
                <span class="mr-1">🔊</span> Listen
              </button>
            </div>
          </div>
          
          <div class="mt-6 bg-indigo-50 p-4 rounded-lg">
            <h4 class="font-medium text-indigo-800">Regional Language Note:</h4>
            <p class="text-sm text-gray-600">{{ culturalInfo[selectedRegion].languageNote }}</p>
          </div>
        </div>

        <!-- Customs & Etiquette Tab -->
        <div v-if="activeTab === 'customs'" class="space-y-8">
          <h3 class="text-xl font-semibold text-gray-900">Local Customs in {{ selectedRegion }}</h3>
          
          <div v-for="(custom, index) in culturalInfo[selectedRegion].customs" :key="index" 
              class="flex p-4 rounded-lg border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition-colors duration-200">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                {{ custom.emoji }}
              </div>
            </div>
            <div class="ml-4">
              <h4 class="text-lg font-medium text-gray-900">{{ custom.title }}</h4>
              <p class="mt-2 text-base text-gray-600">{{ custom.description }}</p>
            </div>
          </div>
          
          <div class="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
            <h4 class="font-medium text-amber-800">Cultural Insight:</h4>
            <p class="text-sm text-gray-600">{{ culturalInfo[selectedRegion].culturalInsight }}</p>
          </div>
        </div>

        <!-- Do's and Don'ts Tab -->
        <div v-if="activeTab === 'dosdonts'" class="space-y-6">
          <h3 class="text-xl font-semibold text-gray-900">Do's and Don'ts in {{ selectedRegion }}</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-green-50 p-5 rounded-lg">
              <h4 class="text-lg font-medium text-green-800 mb-4 flex items-center">
                <span class="text-xl mr-2">✓</span> Do's
              </h4>
              <ul class="space-y-3">
                <li v-for="(item, index) in culturalInfo[selectedRegion].dos" :key="index" class="flex">
                  <span class="flex-shrink-0 text-green-500 mr-2">✓</span>
                  <span class="text-gray-700">{{ item }}</span>
                </li>
              </ul>
            </div>
            <div class="bg-red-50 p-5 rounded-lg">
              <h4 class="text-lg font-medium text-red-800 mb-4 flex items-center">
                <span class="text-xl mr-2">✗</span> Don'ts
              </h4>
              <ul class="space-y-3">
                <li v-for="(item, index) in culturalInfo[selectedRegion].donts" :key="index" class="flex">
                  <span class="flex-shrink-0 text-red-500 mr-2">✗</span>
                  <span class="text-gray-700">{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Dining Etiquette Tab -->
        <div v-if="activeTab === 'dining'" class="space-y-6">
          <h3 class="text-xl font-semibold text-gray-900">Dining Etiquette in {{ selectedRegion }}</h3>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <img src="https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Indian dining" class="rounded-lg w-full h-56 object-cover">
            </div>
            <div class="space-y-4">
              <div v-for="(tip, index) in culturalInfo[selectedRegion].diningEtiquette" :key="index" 
                  class="flex items-start p-3 border-b border-gray-100">
                <span class="text-amber-500 text-lg mr-3">{{ tip.icon }}</span>
                <div>
                  <h5 class="font-medium text-gray-900">{{ tip.title }}</h5>
                  <p class="text-sm text-gray-600">{{ tip.description }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg mt-6">
            <h4 class="font-medium text-gray-900">Common Regional Dishes:</h4>
            <div class="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
              <div v-for="(dish, index) in culturalInfo[selectedRegion].dishes" :key="index" 
                  class="text-sm bg-white p-2 rounded border border-gray-200">
                <span class="font-medium">{{ dish.name }}</span> - {{ dish.description }}
              </div>
            </div>
          </div>
        </div>

        <!-- Festivals Tab -->
        <div v-if="activeTab === 'festivals'" class="space-y-6">
          <h3 class="text-xl font-semibold text-gray-900">Major Festivals in {{ selectedRegion }}</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="(festival, index) in culturalInfo[selectedRegion].festivals" :key="index" 
                class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
              <div class="h-48 bg-gray-200">
                <img :src="festival.image" :alt="festival.name" class="w-full h-full object-cover">
              </div>
              <div class="p-4">
                <div class="flex justify-between items-start">
                  <h4 class="text-lg font-medium text-gray-900">{{ festival.name }}</h4>
                  <span class="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">{{ festival.time }}</span>
                </div>
                <p class="mt-2 text-sm text-gray-600">{{ festival.description }}</p>
                <div class="mt-3 text-xs text-gray-500">{{ festival.tip }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save For Trip Button -->
    <div class="mt-8 flex justify-center">
      <button class="btn-primary px-6 py-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
        Save Cultural Tips for Your Trip
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const regions = ['North India', 'South India', 'East India', 'West India', 'Central India']
const selectedRegion = ref('North India')

const tabs = [
  { id: 'phrases', name: 'Essential Phrases', icon: '🗣️' },
  { id: 'customs', name: 'Customs & Traditions', icon: '🙏' },
  { id: 'dosdonts', name: 'Do\'s and Don\'ts', icon: '✓✗' },
  { id: 'dining', name: 'Dining Etiquette', icon: '🍽️' },
  { id: 'festivals', name: 'Festivals', icon: '🎭' }
]
const activeTab = ref('phrases')

const culturalInfo = {
  'North India': {
    phrases: [
      { english: 'Hello/Greetings', native: 'नमस्ते', pronunciation: 'Namaste' },
      { english: 'Thank you', native: 'धन्यवाद', pronunciation: 'Dhanyavaad' },
      { english: 'Please', native: 'कृपया', pronunciation: 'Kripaya' },
      { english: 'Excuse me', native: 'माफ़ कीजिये', pronunciation: 'Maaf kijiye' },
      { english: 'Yes', native: 'हाँ', pronunciation: 'Haan' },
      { english: 'No', native: 'नहीं', pronunciation: 'Nahi' },
      { english: 'How are you?', native: 'आप कैसे हैं?', pronunciation: 'Aap kaise hain?' },
      { english: 'My name is...', native: 'मेरा नाम ... है', pronunciation: 'Mera naam ... hai' },
      { english: 'How much?', native: 'कितना?', pronunciation: 'Kitna?' }
    ],
    languageNote: 'Hindi is the primary language in North India, but Punjabi is common in Punjab, Urdu in some areas, and English is widely understood in tourist areas and major cities like Delhi, Agra, and Jaipur.',
    customs: [
      {
        emoji: '🙏',
        title: 'Namaste Greeting',
        description: 'Folding your hands in a prayer position with a slight bow is the traditional way to greet people. It\'s respectful and avoids the awkwardness of whether to shake hands, especially with the opposite gender.'
      },
      {
        emoji: '👟',
        title: 'Removing Footwear',
        description: 'Always remove your shoes before entering temples, homes, and some traditional shops. Look for shoes outside or a sign indicating to remove footwear.'
      },
      {
        emoji: '👆',
        title: 'Using Right Hand',
        description: 'The right hand is considered clean and is used for eating, giving and receiving. Avoid using your left hand for these purposes as it\'s traditionally considered unclean.'
      },
      {
        emoji: '🕌',
        title: 'Temple Etiquette',
        description: 'Dress modestly when visiting temples, covering shoulders and knees. Some temples may not allow non-Hindus in the inner sanctum. Follow local customs and observe what others are doing.'
      },
      {
        emoji: '👗',
        title: 'Modest Dress',
        description: 'Northern India tends to be more conservative. Women should avoid revealing clothing. Both men and women should cover shoulders and knees, especially when visiting religious sites.'
      }
    ],
    culturalInsight: 'North India is known for its hierarchical social structure. Showing respect to elders is very important. Address older people as "uncle" or "auntie" as a sign of respect, even if they are strangers.',
    dos: [
      'Accept offers of tea or food when visiting someone\'s home',
      'Cover your head when entering Sikh Gurdwaras',
      'Remove shoes before entering temples and homes',
      'Ask permission before taking photos of locals',
      'Haggle politely at markets (it\'s expected)',
      'Use your right hand for eating and giving items'
    ],
    donts: [
      'Touch people on the head (considered sacred)',
      'Show public displays of affection',
      'Point your feet towards people or religious icons',
      'Wear revealing clothing, especially at religious sites',
      'Touch someone with your feet or shoes',
      'Refuse food offerings directly (politely decline if necessary)'
    ],
    diningEtiquette: [
      {
        icon: '👋',
        title: 'Hand Washing',
        description: 'Always wash your hands before and after meals. Many traditional places will provide a hand washing area.'
      },
      {
        icon: '🖐️',
        title: 'Eating with Hands',
        description: 'In traditional settings, food is eaten with the right hand (never the left). Bread like roti is used to scoop up curries and vegetables.'
      },
      {
        icon: '🍽️',
        title: 'Shared Plates',
        description: 'Food is often served family style with shared dishes in the center. Take small portions initially, as you will likely be encouraged to take more.'
      },
      {
        icon: '🚫',
        title: 'Saying No to Food',
        description: 'Refusing food may be considered impolite. If you\'re full, accept a small amount and leave it on your plate, or politely mention dietary restrictions.'
      }
    ],
    dishes: [
      { name: 'Butter Chicken', description: 'Creamy tomato curry with tender chicken' },
      { name: 'Chole Bhature', description: 'Spicy chickpea curry with fried bread' },
      { name: 'Tandoori Roti', description: 'Clay oven baked flatbread' },
      { name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices' },
      { name: 'Lassi', description: 'Yogurt-based sweet or salty drink' },
      { name: 'Dahi Bhalla', description: 'Lentil dumplings in yogurt with chutneys' }
    ],
    festivals: [
      {
        name: 'Holi',
        time: 'March (Spring)',
        description: 'Festival of colors where people throw colored powders and water at each other, celebrating the arrival of spring and the triumph of good over evil.',
        tip: 'Wear old clothes you don\'t mind getting stained. Apply coconut oil to your skin and hair for easier color removal.',
        image: 'https://images.unsplash.com/photo-1615887457706-bc4405e14d7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Diwali',
        time: 'October-November',
        description: 'Festival of lights celebrated with oil lamps, fireworks, family gatherings, and elaborate feasts. Symbolizes the victory of light over darkness.',
        tip: 'Gift exchanges are common during Diwali. Small boxes of sweets make appropriate gifts if invited to someone\'s home.',
        image: 'https://images.unsplash.com/photo-1605018587486-0aa32ab43a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  'South India': {
    phrases: [
      { english: 'Hello', native: 'வணக்கம்', pronunciation: 'Vanakkam (Tamil)' },
      { english: 'Thank you', native: 'நன்றி', pronunciation: 'Nandri (Tamil)' },
      { english: 'Hello', native: 'നമസ്കാരം', pronunciation: 'Namaskaram (Malayalam)' },
      { english: 'Thank you', native: 'നന്ദി', pronunciation: 'Nandi (Malayalam)' },
      { english: 'Hello', native: 'నమస్కారం', pronunciation: 'Namaskaram (Telugu)' },
      { english: 'Thank you', native: 'ధన్యవాదాలు', pronunciation: 'Dhanyavadalu (Telugu)' },
      { english: 'Hello', native: 'ನಮಸ್ಕಾರ', pronunciation: 'Namaskara (Kannada)' },
      { english: 'Yes', native: 'ಹೌದು', pronunciation: 'Haudu (Kannada)' },
      { english: 'No', native: 'ಇಲ್ಲ', pronunciation: 'Illa (Kannada)' }
    ],
    languageNote: 'South India has four major languages: Tamil (Tamil Nadu), Malayalam (Kerala), Telugu (Andhra Pradesh & Telangana), and Kannada (Karnataka). English is widely spoken in urban areas and tourist destinations.',
    customs: [
      {
        emoji: '👣',
        title: 'Temple Customs',
        description: 'South Indian temples have strict protocols. Remove shoes, men may need to remove shirts in some temples, and women should dress modestly covering shoulders and knees.'
      },
      {
        emoji: '🍲',
        title: 'Banana Leaf Dining',
        description: 'Traditional meals are served on banana leaves. Eat with your right hand, and fold the leaf towards you when finished as a sign of satisfaction.'
      },
      {
        emoji: '🙏',
        title: 'Respecting Elders',
        description: 'Touching the feet of elders as a sign of respect is common. Younger people may seek blessings from elders, especially during festivals or important occasions.'
      },
      {
        emoji: '👩‍🦱',
        title: 'Traditional Dress',
        description: 'Women commonly wear sarees or salwar kameez. Men often wear a dhoti or lungi, especially in rural areas. More modern Western clothing is common in cities.'
      }
    ],
    culturalInsight: 'South Indian culture places strong emphasis on arts, especially classical dance forms like Bharatanatyam, Kathakali, and Kuchipudi. The region is also known for its strong matrilineal traditions in certain communities, especially in Kerala.',
    dos: [
      'Accept food and drink offered with both hands',
      'Use your right hand for eating',
      'Remove footwear before entering homes and temples',
      'Cover your head when entering certain temple sanctums',
      'Ask permission before photographing people',
      'Try eating on a banana leaf when offered'
    ],
    donts: [
      'Touch or pass objects with your left hand',
      'Wear shoes inside temples or homes',
      'Touch people on the head',
      'Display public affection',
      'Wear revealing clothing at religious sites',
      'Criticize or make fun of local customs'
    ],
    diningEtiquette: [
      {
        icon: '🌿',
        title: 'Banana Leaf Dining',
        description: 'When eating from a banana leaf, the leaf tip should point to your left. Fold the leaf toward you (not away) after eating to signal you enjoyed the meal.'
      },
      {
        icon: '👌',
        title: 'Eating Technique',
        description: 'Mix rice with curries using your fingertips, then form small balls and place them in your mouth without touching your lips to your hand.'
      },
      {
        icon: '💧',
        title: 'Washing Hands',
        description: 'Always wash hands before and after eating. In traditional settings, a server may bring water and a bowl for hand washing to the table.'
      },
      {
        icon: '🥘',
        title: 'Serving Order',
        description: 'Food is served in a specific order, usually starting with rice and ending with yogurt. Wait for each item to be served rather than asking for everything at once.'
      }
    ],
    dishes: [
      { name: 'Dosa', description: 'Crispy fermented rice and lentil crepe' },
      { name: 'Idli Sambar', description: 'Steamed rice cakes with lentil soup' },
      { name: 'Appam', description: 'Lacy rice pancakes with coconut milk' },
      { name: 'Chettinad Curry', description: 'Spicy curry with distinctive spice blend' },
      { name: 'Filter Coffee', description: 'Strong coffee mixed with milk' },
      { name: 'Payasam', description: 'Sweet milk pudding with rice or vermicelli' }
    ],
    festivals: [
      {
        name: 'Pongal',
        time: 'January 14-17',
        description: 'Harvest festival celebrated over four days with special dishes, decorated cattle, and thanksgiving to the Sun God.',
        tip: 'The main dish is also called Pongal - a sweet rice preparation that "overflows" from the pot symbolizing abundance.',
        image: 'https://images.unsplash.com/photo-1610734447998-5c1f05ece254?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Onam',
        time: 'August-September',
        description: 'Kerala\'s harvest festival featuring boat races, tiger dances, elaborate flower arrangements (pookalams), and grand feasts.',
        tip: 'The Sadhya (feast) served during Onam can have up to 26 dishes served on a banana leaf.',
        image: 'https://images.unsplash.com/photo-1598189569123-ed6973394b33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  // Basic stubs for other regions - these would be expanded with complete information
  'East India': {
    phrases: [
      { english: 'Hello', native: 'নমস্কার', pronunciation: 'Nomoshkar (Bengali)' },
      { english: 'Thank you', native: 'ধন্যবাদ', pronunciation: 'Dhonyobad (Bengali)' },
      { english: 'How are you?', native: 'কেমন আছেন?', pronunciation: 'Kemon achhen?' }
    ],
    languageNote: 'Bengali is the primary language in West Bengal and widely spoken in the Northeast. Odiya is spoken in Odisha. English is common in urban areas and tourist destinations.',
    customs: [
      {
        emoji: '🌺',
        title: 'Offering Sweets',
        description: 'Sweet dishes are extremely important in Bengali culture and are often the first thing offered to guests or during celebrations.'
      }
    ],
    culturalInsight: 'East India, particularly Bengal, has a rich literary and artistic tradition. The region is known for its contributions to literature, cinema, and performing arts.',
    dos: ['Appreciate cultural discussions on literature and arts', 'Try traditional sweets'],
    donts: ['Rush meals or discussions', 'Be wasteful with food'],
    diningEtiquette: [
      {
        icon: '🍚',
        title: 'Course Order',
        description: 'Traditional Bengali meals start with bitter dishes and end with sweets.'
      }
    ],
    dishes: [
      { name: 'Rasgulla', description: 'Soft cottage cheese balls in sugar syrup' },
      { name: 'Machher Jhol', description: 'Traditional fish curry' }
    ],
    festivals: [
      {
        name: 'Durga Puja',
        time: 'September-October',
        description: 'Grand festival celebrating Goddess Durga with elaborate pandals, cultural performances, and community feasts.',
        tip: 'Visit multiple pandals (temporary structures) to see diverse artistic interpretations of the goddess and her story.',
        image: 'https://images.unsplash.com/photo-1635492491273-455af7728453?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  'West India': {
    phrases: [
      { english: 'Hello', native: 'नमस्कार', pronunciation: 'Namaskar (Marathi)' },
      { english: 'Hello', native: 'કેમ છો', pronunciation: 'Kem chho (Gujarati)' }
    ],
    languageNote: 'Marathi is spoken in Maharashtra, Gujarati in Gujarat, and Konkani in Goa. Hindi and English are widely understood across the region.',
    customs: [
      {
        emoji: '🎭',
        title: 'Festival Participation',
        description: 'Western India celebrates festivals like Ganesh Chaturthi and Navratri with great enthusiasm. Visitors are welcome to join in but should follow local customs.'
      }
    ],
    culturalInsight: 'Western India is known for its entrepreneurial spirit and business acumen, particularly in Gujarat and Maharashtra. The region blends traditional values with progressive thinking.',
    dos: ['Join local festival celebrations if invited', 'Try the distinctive regional cuisines'],
    donts: ['Expect meat dishes in certain religious communities', 'Wear beachwear away from beach areas in Goa'],
    diningEtiquette: [
      {
        icon: '🥘',
        title: 'Thali Meals',
        description: 'Traditional meals are served as thalis (platters) with multiple small dishes. Typically unlimited refills are provided.'
      }
    ],
    dishes: [
      { name: 'Dhokla', description: 'Steamed fermented gram flour cake' },
      { name: 'Vada Pav', description: 'Spicy potato fritter in a bun' }
    ],
    festivals: [
      {
        name: 'Ganesh Chaturthi',
        time: 'August-September',
        description: 'Festival honoring Lord Ganesh with elaborate clay idols, processions, and immersion ceremonies.',
        tip: 'In Mumbai, the best experience is watching the immersion processions at Chowpatty Beach.',
        image: 'https://images.unsplash.com/photo-1567591414240-e9c0878ff1d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  'Central India': {
    phrases: [
      { english: 'Hello', native: 'नमस्ते', pronunciation: 'Namaste (Hindi)' },
      { english: 'Thank you', native: 'धन्यवाद', pronunciation: 'Dhanyavaad (Hindi)' }
    ],
    languageNote: 'Hindi is the main language in Madhya Pradesh and Chhattisgarh, with various dialects. English is less common outside major tourist destinations.',
    customs: [
      {
        emoji: '🏞️',
        title: 'Tribal Traditions',
        description: 'Central India has significant tribal populations with unique customs. When visiting tribal areas, be respectful of local traditions and ask before taking photographs.'
      }
    ],
    culturalInsight: 'Central India is known for its tribal heritage and impressive temple architecture, particularly the temples of Khajuraho famous for their intricate carvings.',
    dos: ['Dress modestly when visiting tribal villages', 'Ask permission before photographing tribal communities'],
    donts: ['Make judgments about traditional tribal practices', 'Dismiss the historical importance of local monuments'],
    diningEtiquette: [
      {
        icon: '🍛',
        title: 'Spice Levels',
        description: 'Central Indian cuisine can be quite spicy. Don\'t hesitate to request milder spice levels if needed.'
      }
    ],
    dishes: [
      { name: 'Poha', description: 'Flattened rice dish with spices and peanuts' },
      { name: 'Bhutte Ka Kees', description: 'Grated corn with spices' }
    ],
    festivals: [
      {
        name: 'Lokrang Festival',
        time: 'January',
        description: 'Cultural festival in Bhopal celebrating folk art, crafts, music and dance forms from across India.',
        tip: 'The tribal art exhibitions provide insight into Central India\'s rich indigenous traditions.',
        image: 'https://images.unsplash.com/photo-1624283361663-8e3db38edc41?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
      }
    ]
  }
}
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.input-field {
  @apply mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md;
}

.btn-primary {
  @apply bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
}

.btn-secondary {
  @apply bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
}
</style> 