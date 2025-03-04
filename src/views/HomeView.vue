<template>
  <div class="home-view">
    <!-- Hero Section with Background Image -->
    <div class="relative">
      <div class="absolute inset-0 bg-gradient-to-r from-indigo-900/70 to-purple-900/70 z-10"></div>
      <div class="relative h-[600px] bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div class="relative z-20 max-w-2xl">
            <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              <span class="block">Discover India's</span>
              <span class="block text-indigo-200">Cultural Heritage</span>
            </h1>
            <p class="mt-3 text-base text-white sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
              Experience the vibrant colors, rich traditions, and ancient wonders of India with personalized cultural itineraries.
            </p>
            
            <!-- Search Bar with Filters -->
            <div class="mt-8 bg-white rounded-lg shadow-xl p-4">
              <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-grow">
                  <label for="destination" class="block text-sm font-medium text-gray-700">Where do you want to travel?</label>
                  <select id="destination" v-model="searchDestination" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option value="">Select a destination</option>
                    <option v-for="dest in indianDestinations" :key="dest" :value="dest">{{ dest }}</option>
                  </select>
                </div>
                <div>
                  <label for="interest" class="block text-sm font-medium text-gray-700">Cultural Interest</label>
                  <select id="interest" v-model="searchInterest" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option value="">All Interests</option>
                    <option v-for="interest in culturalInterests" :key="interest.id" :value="interest.id">{{ interest.name }}</option>
                  </select>
                </div>
                <div class="self-end">
                  <button @click="navigateToItinerary" class="w-full flex items-center justify-center px-8 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Plan My Trip
                  </button>
                </div>
              </div>
            </div>
            
            <div class="mt-5 sm:mt-8 sm:flex sm:justify-start">
              <div class="rounded-md shadow">
                <button @click="navigateToItinerary" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                  Plan My Journey
                </button>
              </div>
              <div class="mt-3 sm:mt-0 sm:ml-3">
                <button @click="navigateToGuides" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                  Find Local Guides
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Destinations -->
    <div class="bg-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Explore India's Iconic Destinations
          </h2>
          <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Discover the beauty, history, and cultural richness of India's most famous landmarks
          </p>
        </div>
        
        <div class="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="(destination, index) in featuredDestinations" :key="index" class="group relative overflow-hidden rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
            <div class="relative h-80 w-full overflow-hidden">
              <img :src="destination.image" :alt="destination.name" class="h-full w-full object-cover">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>
            <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 class="text-xl font-bold">{{ destination.name }}</h3>
              <p class="mt-1 text-sm">{{ destination.description }}</p>
              <button 
                @click="navigateToItineraryWithDestination(destination.name.split(',')[0])" 
                class="mt-4 px-4 py-2 bg-white text-indigo-700 rounded-md font-medium hover:bg-indigo-50 transition inline-block"
              >
                Explore
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Testimonials Slider -->
    <div class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold text-gray-900 text-center">
          What Our Travelers Say
        </h2>
        
        <div class="mt-12 max-w-3xl mx-auto">
          <div class="bg-white shadow-xl rounded-lg overflow-hidden">
            <div class="px-6 py-8">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                  <img :src="testimonials[currentTestimonialIndex].image" :alt="testimonials[currentTestimonialIndex].name" class="h-full w-full object-cover">
                </div>
                <div class="ml-4">
                  <h4 class="text-lg font-bold text-gray-900">{{ testimonials[currentTestimonialIndex].name }}</h4>
                  <div class="flex text-yellow-400">
                    <span v-for="i in testimonials[currentTestimonialIndex].rating" :key="i">★</span>
                  </div>
                </div>
              </div>
              <p class="mt-4 text-gray-600 italic">
                "{{ testimonials[currentTestimonialIndex].text }}"
              </p>
            </div>
            
            <div class="bg-gray-50 px-6 py-4 flex justify-between">
              <button @click="previousTestimonial" class="text-indigo-600 hover:text-indigo-800">
                ← Previous
              </button>
              <button @click="nextTestimonial" class="text-indigo-600 hover:text-indigo-800">
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cultural Experiences -->
    <div class="bg-white">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Immersive Cultural Experiences
        </h2>
        <div class="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="(feature, index) in features" :key="index" class="group relative">
            <div class="w-full bg-indigo-100 rounded-lg overflow-hidden aspect-w-3 aspect-h-2 group-hover:opacity-75 transition-opacity">
              <div class="h-48 flex items-center justify-center cultural-container">
                <template v-if="feature.title === 'Culinary Journeys'">
                  <span v-for="(emoji, emojiIndex) in feature.emojis" :key="emojiIndex"
                    class="cultural-emoji"
                    :style="`--delay: ${emojiIndex * 0.5}s`">
                    {{ emoji }}
                  </span>
                </template>
                <template v-else>
                  <span v-for="(emoji, emojiIndex) in feature.emojis" :key="emojiIndex"
                    class="cultural-emoji"
                    :style="`--delay: ${emojiIndex * 0.5}s`">
                    {{ emoji }}
                  </span>
                </template>
              </div>
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">{{ feature.title }}</h3>
            <p class="mt-1 text-sm text-gray-500">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Cultural Events -->
    <div class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Upcoming Cultural Events
          </h2>
          <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Plan your trip around these authentic cultural celebrations
          </p>
        </div>
        
        <div class="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="(event, index) in upcomingEvents" :key="index" class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="relative">
              <img :src="event.image" :alt="event.name" class="w-full h-48 object-cover">
              <div class="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 m-2 rounded-full text-sm font-medium">
                {{ event.date }}
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-lg font-bold text-gray-900">{{ event.name }}</h3>
              <p class="mt-2 text-sm text-gray-600">{{ event.location }}</p>
              <p class="mt-3 text-gray-700">{{ event.description }}</p>
              <div class="mt-4 flex justify-between items-center">
                <span class="text-sm text-indigo-600">{{ event.category }}</span>
                <button class="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md font-medium hover:bg-indigo-200 transition">
                  Add to Itinerary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Newsletter Subscription -->
    <div class="bg-indigo-700">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <div class="lg:w-0 lg:flex-1">
          <h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Stay updated with cultural events
          </h2>
          <p class="mt-3 max-w-3xl text-lg leading-6 text-indigo-200">
            Subscribe to our newsletter for the latest cultural events, festivals, and travel tips for your Indian adventure.
          </p>
        </div>
        <div class="mt-8 lg:mt-0 lg:ml-8">
          <form class="sm:flex">
            <label for="email-address" class="sr-only">Email address</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required v-model="newsletterEmail" 
              class="w-full px-5 py-3 border border-transparent placeholder-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white focus:border-white sm:max-w-xs rounded-md"
              placeholder="Enter your email">
            <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
              <button @click.prevent="subscribeNewsletter" type="submit" 
                class="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white">
                Subscribe
              </button>
            </div>
          </form>
          <p class="mt-3 text-sm text-indigo-200">
            We care about your data. Read our 
            <router-link to="/privacy-policy" class="text-white font-medium underline">
              Privacy Policy
            </router-link>.
          </p>
        </div>
      </div>
    </div>

    <!-- Floating Quick Help Button -->
    <div class="fixed bottom-8 right-8 z-50">
      <!-- Steps Dialog -->
      <div v-if="showStepsDialog" class="absolute bottom-24 right-0 w-96 bg-white rounded-lg shadow-xl p-6 mb-4 sm:w-96 w-screen max-w-[calc(100vw-2rem)] mx-2 sm:mx-0 sm:right-0">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-indigo-600">Plan Your Cultural Journey</h3>
          <button @click="showStepsDialog = false" class="text-gray-500 hover:text-gray-700">
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-indigo-600 font-semibold">1</span>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Sign Up or Login</h4>
              <p class="mt-1 text-sm text-gray-500">Create your Yatrasangam account to access personalized recommendations.</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-indigo-600 font-semibold">2</span>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Choose Your Destination</h4>
              <p class="mt-1 text-sm text-gray-500">Select from our curated list of cultural destinations across India.</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-indigo-600 font-semibold">3</span>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Select Your Interests</h4>
              <p class="mt-1 text-sm text-gray-500">Pick from cultural experiences like food, art, festivals, and historical sites.</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-indigo-600 font-semibold">4</span>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Customize Your Journey</h4>
              <p class="mt-1 text-sm text-gray-500">Set your travel dates, preferences, and special requirements.</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-indigo-600 font-semibold">5</span>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Connect with Local Guides</h4>
              <p class="mt-1 text-sm text-gray-500">Optional: Enhance your experience with our verified local cultural guides.</p>
            </div>
          </div>
          <div class="mt-6">
            <button 
              @click="startPlanning" 
              class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              Start Planning Now
            </button>
          </div>
        </div>
      </div>

      <!-- Guide Finding Dialog -->
      <div v-if="showGuideDialog" class="absolute bottom-24 right-0 w-96 bg-white rounded-lg shadow-xl p-6 mb-4 sm:w-96 w-screen max-w-[calc(100vw-2rem)] mx-2 sm:mx-0 sm:right-0">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-indigo-600">Find Your Perfect Local Guide</h3>
          <button @click="showGuideDialog = false" class="text-gray-500 hover:text-gray-700">
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-indigo-600 font-semibold">1</span>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Choose Your Destination</h4>
              <p class="mt-1 text-sm text-gray-500">Select the city or region where you need a local cultural guide.</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-indigo-600 font-semibold">2</span>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Specify Your Interests</h4>
              <p class="mt-1 text-sm text-gray-500">Filter guides by expertise in art, history, cuisine, spirituality, or local traditions.</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-indigo-600 font-semibold">3</span>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Language Preferences</h4>
              <p class="mt-1 text-sm text-gray-500">Find guides who speak your preferred languages for better communication.</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-indigo-600 font-semibold">4</span>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Browse & Connect</h4>
              <p class="mt-1 text-sm text-gray-500">View detailed profiles, ratings, and reviews of verified local guides.</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-indigo-600 font-semibold">5</span>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Book & Customize</h4>
              <p class="mt-1 text-sm text-gray-500">Schedule your guided experience and discuss your specific interests and requirements.</p>
            </div>
          </div>
          <div class="mt-6">
            <button 
              @click="startFindingGuide" 
              class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              Find Your Guide
            </button>
          </div>
        </div>
      </div>

      <!-- Cultural Tips Dialog -->
      <div v-if="showCulturalTipsDialog" class="absolute bottom-24 right-0 w-96 bg-white rounded-lg shadow-xl p-6 mb-4 max-h-[calc(100vh-200px)] overflow-y-auto sm:w-96 w-screen max-w-[calc(100vw-2rem)] mx-2 sm:mx-0 sm:right-0">
        <div class="flex justify-between items-center mb-4 sticky top-0 bg-white pb-4 border-b">
          <h3 class="text-xl font-bold text-indigo-600">AI-Powered Cultural Journey Planning</h3>
          <button @click="showCulturalTipsDialog = false" class="text-gray-500 hover:text-gray-700">
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-indigo-600 font-semibold">1</span>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Smart Destination Analysis</h4>
              <p class="mt-1 text-sm text-gray-500">Our AI analyzes cultural hotspots, local festivals, and seasonal events to suggest the perfect destinations for your interests.</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-indigo-600 font-semibold">2</span>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Personalized Experience Matching</h4>
              <p class="mt-1 text-sm text-gray-500">Based on your interests in art, cuisine, spirituality, or history, our AI curates experiences that match your cultural preferences.</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-indigo-600 font-semibold">3</span>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Dynamic Scheduling</h4>
              <p class="mt-1 text-sm text-gray-500">The AI optimizes your daily schedule considering factors like travel time, cultural event timings, and your preferred pace.</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-indigo-600 font-semibold">4</span>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Cultural Context Integration</h4>
              <p class="mt-1 text-sm text-gray-500">Each activity comes with AI-generated cultural insights, local customs, and historical significance to enrich your experience.</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span class="text-indigo-600 font-semibold">5</span>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Real-time Adaptability</h4>
              <p class="mt-1 text-sm text-gray-500">Our AI continuously learns from traveler feedback to improve recommendations and adapt to changing cultural landscapes.</p>
            </div>
          </div>
          <div class="mt-6">
            <button 
              @click="startCulturalPlanning" 
              class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              Start Planning
            </button>
          </div>
        </div>
      </div>

      <!-- Contact Dialog -->
      <div v-if="showContactDialog" class="absolute bottom-24 right-0 w-96 bg-white rounded-lg shadow-xl p-6 mb-4 sm:w-96 w-screen max-w-[calc(100vw-2rem)] mx-2 sm:mx-0 sm:right-0">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-indigo-600">Our Team</h3>
          <button @click="showContactDialog = false" class="text-gray-500 hover:text-gray-700">
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <!-- Team Lead -->
          <div class="bg-indigo-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span class="text-indigo-600 font-semibold">TL</span>
              </div>
              <div class="ml-4">
                <h4 class="text-sm font-medium text-gray-900">Team Lead</h4>
                <p class="text-sm text-gray-500">Abhishek Maurya</p>
              </div>
            </div>
          </div>
          
          <!-- Team Members -->
          <div class="space-y-3">
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
              <div class="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span class="text-gray-600 font-medium">1</span>
              </div>
              <div class="ml-3">
                <p class="text-sm text-gray-900">Aarti Aahu</p>
              </div>
            </div>
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
              <div class="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span class="text-gray-600 font-medium">2</span>
              </div>
              <div class="ml-3">
                <p class="text-sm text-gray-900">Atul Singh</p>
              </div>
            </div>
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
              <div class="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span class="text-gray-600 font-medium">3</span>
              </div>
              <div class="ml-3">
                <p class="text-sm text-gray-900">Ragini Gupta</p>
              </div>
            </div>
          </div>

          <!-- Contact Button -->
          <div class="mt-6">
            <a 
              href="mailto:team@culturalplanner.com" 
              class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Contact Team
            </a>
          </div>
        </div>
      </div>

      <!-- AI Chat Dialog -->
      <div v-if="showAIDialog" class="absolute bottom-24 right-0 w-96 bg-white rounded-lg shadow-xl p-6 mb-4 max-h-[calc(100vh-200px)] overflow-hidden flex flex-col sm:w-96 w-screen max-w-[calc(100vw-2rem)] mx-2 sm:mx-0 sm:right-0">
        <div class="flex justify-between items-center mb-4 sticky top-0 bg-white pb-4 border-b">
          <h3 class="text-xl font-bold text-indigo-600">YatraSangamAI Assistant</h3>
          <button @click="showAIDialog = false" class="text-gray-500 hover:text-gray-700">
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto ai-chat-messages space-y-4 mb-4">
          <template v-for="(msg, index) in chatHistory" :key="index">
            <!-- AI Message -->
            <div v-if="msg.type === 'ai'" class="flex items-start">
              <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <span class="text-indigo-600">🤖</span>
              </div>
              <div class="ml-4 bg-gray-50 rounded-lg p-4 max-w-[85%]">
                <p class="text-sm text-gray-700 whitespace-pre-line">{{ msg.message }}</p>
              </div>
            </div>
            
            <!-- User Message -->
            <div v-else class="flex items-start justify-end">
              <div class="mr-4 bg-indigo-600 rounded-lg p-4 max-w-[85%]">
                <p class="text-sm text-white">{{ msg.message }}</p>
              </div>
              <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <span class="text-white">👤</span>
              </div>
            </div>
          </template>
        </div>
        
        <div class="border-t pt-4 mt-auto">
          <div class="flex flex-col space-y-2">
            <input 
              v-model="aiMessage" 
              type="text" 
              placeholder="Ask about destinations, food, festivals, etc..." 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              @keyup.enter="sendAIMessage"
            >
            <button 
              @click="sendAIMessage" 
              class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
            >
              <span>Send Message</span>
              <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Help Panel with transition -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div v-if="showHelpPanel" class="absolute bottom-16 right-0 sm:w-72 w-screen max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl p-4 mb-4 border border-gray-100 mx-2 sm:mx-0 sm:right-0">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-bold text-gray-900">How can we help?</h3>
            <button @click="closeHelpPanel" class="text-gray-500 hover:text-gray-700 transition-colors">
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <div class="space-y-2">
            <button 
              @click="openDialog('planning')" 
              class="w-full text-left px-3 py-2.5 rounded-md hover:bg-indigo-50 text-sm flex items-center group transition-colors"
            >
              <span class="text-indigo-600 mr-2 group-hover:scale-110 transition-transform">🗓️</span> 
              <span class="group-hover:text-indigo-600 transition-colors">Plan my itinerary</span>
            </button>
            <button 
              @click="openDialog('guide')" 
              class="w-full text-left px-3 py-2.5 rounded-md hover:bg-indigo-50 text-sm flex items-center group transition-colors"
            >
              <span class="text-indigo-600 mr-2 group-hover:scale-110 transition-transform">🧭</span>
              <span class="group-hover:text-indigo-600 transition-colors">Find local guides</span>
            </button>
            <button 
              @click="openDialog('cultural')" 
              class="w-full text-left px-3 py-2.5 rounded-md hover:bg-indigo-50 text-sm flex items-center group transition-colors"
            >
              <span class="text-indigo-600 mr-2 group-hover:scale-110 transition-transform">💬</span>
              <span class="group-hover:text-indigo-600 transition-colors">Cultural tips</span>
            </button>
            <button 
              @click="openDialog('contact')" 
              class="w-full text-left px-3 py-2.5 rounded-md hover:bg-indigo-50 text-sm flex items-center group transition-colors"
            >
              <span class="text-indigo-600 mr-2 group-hover:scale-110 transition-transform">👥</span>
              <span class="group-hover:text-indigo-600 transition-colors">Contact us</span>
            </button>
            <button 
              @click="openDialog('ai')" 
              class="w-full text-left px-3 py-2.5 rounded-md hover:bg-indigo-50 text-sm flex items-center group transition-colors"
            >
              <span class="text-indigo-600 mr-2 group-hover:scale-110 transition-transform">🤖</span>
              <span class="group-hover:text-indigo-600 transition-colors">Talk with YatraSangamAI</span>
            </button>
          </div>
        </div>
      </Transition>

      <!-- Help Button with animation -->
      <button 
        @click="toggleHelpPanel"
        class="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        :class="{ 'rotate-180': showHelpPanel }"
      >
        <span class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span v-if="!showHelpPanel" class="ml-2 font-medium">Need Help?</span>
        </span>
      </button>
    </div>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-16">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <p class="text-gray-600">Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isDev = import.meta.env.MODE === 'development'

const searchDestination = ref('')
const searchInterest = ref('')
const currentTestimonialIndex = ref(0)
const newsletterEmail = ref('')
const showHelpPanel = ref(false)
const showStepsDialog = ref(false)
const showGuideDialog = ref(false)
const showCulturalTipsDialog = ref(false)
const showContactDialog = ref(false)
const showAIDialog = ref(false)
const aiMessage = ref('')
const chatHistory = ref([
  {
    type: 'ai',
    message: "Hello! I'm YatraSangamAI, your personal cultural journey assistant. How can I help you plan your Indian adventure today?"
  }
])

// Dialog state management
const activeDialog = ref(null)

// Function to generate AI response using OpenRouter API
const generateAIResponse = async (message) => {
  try {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
    const model = import.meta.env.VITE_OPENROUTER_MODEL || 'deepseek/deepseek-r1-distill-llama-70b:free'
    
    if (!apiKey) {
      console.error('OpenRouter API key is missing')
      return findMatchingAnswer(message) // Fallback to predefined answers
    }
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.href,
        'X-Title': 'Cultural Planner'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { 
            role: 'system', 
            content: `You are YatraSangamAI, a friendly cultural travel expert specializing in India.
            Format your responses in a clean, conversational style:
            - Use natural language without markdown headers or bullet points
            - Separate topics with line breaks instead of headers
            - Use dashes (-) instead of bullet points for lists
            - Start each main point with an appropriate emoji
            - Keep the tone warm and engaging
            - Use simple text formatting with line breaks for structure
            - Avoid using stars (*) or markdown headers (#)
            
            Example format:
            "Let me tell you about the best time to visit Varanasi! 🌞
            
            The winter season from October to March is perfect, with cool and pleasant weather for exploring the ghats and temples.
            
            Here's when to plan your visit:
            
            🌅 Morning - Perfect for boat rides and watching sunrise ceremonies
            🌞 Afternoon - Explore the ancient temples and narrow lanes
            🌙 Evening - Experience the magical Ganga Aarti ceremony
            
            Would you like to know more about any specific activities or ceremonies?"`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenRouter API error:', errorData)
      return findMatchingAnswer(message) // Fallback to predefined answers
    }
    
    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('Error generating AI response:', error)
    return findMatchingAnswer(message) // Fallback to predefined answers
  }
}

// Function to handle sending AI messages
const sendAIMessage = async () => {
  if (!aiMessage.value.trim()) return

  // Add user message to chat history
  chatHistory.value.push({
    type: 'user',
    message: aiMessage.value
  })

  // Show typing indicator
  chatHistory.value.push({
    type: 'ai',
    message: '...',
    isTyping: true
  })

  try {
    // Generate AI response
    const response = await generateAIResponse(aiMessage.value)
    
    // Remove typing indicator
    chatHistory.value = chatHistory.value.filter(msg => !msg.isTyping)
    
    // Add AI response to chat history
    chatHistory.value.push({
      type: 'ai',
      message: response
    })
  } catch (error) {
    console.error('Error in sendAIMessage:', error)
    
    // Remove typing indicator
    chatHistory.value = chatHistory.value.filter(msg => !msg.isTyping)
    
    // Add fallback response
    chatHistory.value.push({
      type: 'ai',
      message: findMatchingAnswer(aiMessage.value)
    })
  }

  // Clear input
  aiMessage.value = ''

  // Scroll to bottom of chat
  setTimeout(() => {
    const chatContainer = document.querySelector('.ai-chat-messages')
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }, 100)
}

// Function to find matching predefined answer
const findMatchingAnswer = (message) => {
  const lowercaseMessage = message.toLowerCase()
  for (const [category, data] of Object.entries(predefinedAnswers)) {
    if (data.keywords.some(keyword => lowercaseMessage.includes(keyword.toLowerCase()))) {
      return data.response
    }
  }
  return null
}

// Predefined answers based on keywords
const predefinedAnswers = {
  'greetings': {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'how are you', 'how are you today', 'good morning', 'good afternoon', 'good evening'],
    response: "Namaste! 🙏 I'm doing great and excited to help you explore India's rich cultural heritage! How may I assist you with your travel plans today?"
  },
  'farewell': {
    keywords: ['bye', 'goodbye', 'see you', 'farewell', 'take care', 'thanks', 'thank you'],
    response: "धन्यवाद (Dhanyavaad)! 🙏 Thank you for chatting with me. I hope I helped you discover more about India's amazing culture. Feel free to return anytime for more travel assistance!"
  },
  'location': {
    keywords: ['where are you', 'your location', 'where are you located', 'where do you live'],
    response: "I'm your virtual guide within the YatraSangam app! 🏛️\n\nWhile I don't have a physical location, I'm here to help you explore all of India's cultural wonders:\n\n" +
      "🏰 The majestic forts of Rajasthan\n" +
      "🕌 The spiritual ghats of Varanasi\n" +
      "🌊 The serene backwaters of Kerala\n\n" +
      "Where would you like to explore today?"
  },
  'time': {
    keywords: ['what time', 'current time', 'time now', 'what day', 'what date', 'current date', 'today date'],
    response: "As your cultural journey assistant, I can help you plan activities for any time! 🕒\n\nFor the best experience, I recommend:\n\n" +
      "🌅 Early morning temple visits\n" +
      "🍲 Afternoon cooking classes\n" +
      "🎭 Evening cultural performances\n\n" +
      "When are you planning to visit India?"
  },
  'identity': {
    keywords: ['who are you', 'what are you', 'your name', 'about you', 'tell me about yourself', 'introduce yourself'],
    response: "Hello! 👋 I'm YatraSangamAI, your dedicated cultural journey assistant for exploring India. I'm here to help you:\n\n" +
      "🧭 Plan personalized cultural itineraries\n" +
      "🎭 Learn about local traditions and customs\n" +
      "🍛 Discover regional cuisines and food experiences\n" +
      "🏛️ Explore historical sites and monuments\n" +
      "🎨 Find authentic cultural experiences\n\n" +
      "How can I assist you with your Indian cultural journey today?"
  },
  'capabilities': {
    keywords: ['what can you do', 'help me with', 'your features', 'how can you help', 'what do you do'],
    response: "I'm here to be your cultural guide to India! I can help you with:\n\n" +
      "📍 Finding the perfect destinations based on your interests\n" +
      "📅 Creating customized travel itineraries\n" +
      "🗺️ Connecting you with local cultural guides\n" +
      "🎊 Information about festivals and events\n" +
      "🍽️ Regional food recommendations\n" +
      "🚂 Transportation advice\n\n" +
      "What would you like to know more about?"
  },
  'creator': {
    keywords: ['who made you', 'who created you', 'your creator', 'your team', 'who built you', 'your developers'],
    response: "I was created by the talented team at YatraSangam:\n\n" +
      "👨‍💻 Team Lead: Abhishek Maurya\n" +
      "👥 Development Team:\n" +
      "   • Aarti Aahu\n" +
      "   • Atul Singh\n" +
      "   • Ragini Gupta\n\n" +
      "Together, they've designed me to help travelers discover and experience India's rich cultural heritage! 🙏"
  },
  'destination': {
    keywords: ['where', 'destination', 'place', 'city', 'location', 'visit'],
    response: "Let me recommend some amazing destinations for you:\n\n" +
      "🏰 Rajasthan (Jaipur, Udaipur) - Royal heritage and desert culture\n" +
      "🕌 Agra - Home of the iconic Taj Mahal\n" +
      "🙏 Varanasi - Spiritual experiences along the Ganges\n" +
      "🏖️ Kerala - Backwaters and traditional arts\n" +
      "🍛 Delhi - Diverse cuisines and historical monuments\n\n" +
      "Which of these interests you the most?"
  },
  'food': {
    keywords: ['food', 'cuisine', 'eat', 'restaurant', 'dish', 'cooking'],
    response: "Let me tell you about India's incredible cuisine!\n\n" +
      "🍛 North India - Rich curries, naan bread, and tandoori dishes\n" +
      "🥘 South India - Dosas, idlis, and coconut-based curries\n" +
      "🍜 East India - Fish curries and sweet delicacies\n" +
      "🫔 West India - Street food and Gujarati thali\n\n" +
      "Would you like me to help you find cooking classes or food tours in any region?"
  },
  'festival': {
    keywords: ['festival', 'celebration', 'event', 'cultural event', 'traditional'],
    response: "Here are some wonderful Indian festivals you might want to experience:\n\n" +
      "🪔 Diwali (Oct/Nov) - Festival of Lights\n" +
      "🎨 Holi (Feb/Mar) - Festival of Colors\n" +
      "🐪 Pushkar Fair (Nov) - Traditional camel fair\n" +
      "🎭 Kochi Biennale (Dec-Mar) - Art festival\n\n" +
      "Would you like to know specific dates for any of these festivals?"
  },
  'transport': {
    keywords: ['transport', 'travel', 'train', 'bus', 'car', 'flight'],
    response: "Let me share the best ways to travel in India:\n\n" +
      "✈️ Flights - Quick connections between major cities\n" +
      "🚂 Trains - Scenic routes and comfortable overnight travel\n" +
      "🚗 Private car - Flexibility for local sightseeing\n" +
      "🚌 Buses - Budget-friendly local travel\n\n" +
      "I can help you plan your transportation based on your itinerary!"
  },
  'weather': {
    keywords: ['weather', 'climate', 'season', 'temperature', 'rain', 'monsoon'],
    response: "Let me help you plan the perfect time for your visit:\n\n" +
      "🌞 October to March - Perfect weather in most regions\n" +
      "🌧️ June to September - Monsoon season (best to avoid)\n" +
      "🌡️ April to June - Summer (quite hot)\n" +
      "❄️ December to February - Cool in North India\n\n" +
      "When are you thinking of visiting?"
  },
  'shopping': {
    keywords: ['shop', 'buy', 'market', 'souvenir', 'handicraft'],
    response: "India offers wonderful shopping experiences:\n\n" +
      "🧵 Textiles - Beautiful silk sarees and pashmina shawls\n" +
      "💎 Jewelry - Intricate silver work and precious stones\n" +
      "🎨 Handicrafts - Traditional pottery and paintings\n" +
      "🪔 Home decor - Brass items and handwoven carpets\n\n" +
      "Would you like recommendations for specific items or markets?"
  },
  'guide': {
    keywords: ['guide', 'tour', 'guided', 'local expert'],
    response: "Our local guides will enhance your cultural experience with:\n\n" +
      "🧭 Deep local knowledge and hidden gems\n" +
      "🗣️ Language assistance and cultural translation\n" +
      "🏛️ Rich historical insights and stories\n" +
      "🤝 Cultural etiquette guidance\n\n" +
      "Would you like to connect with a guide for a specific destination?"
  }
}

// Function to check if user is logged in and navigate accordingly
const navigateToItinerary = () => {
  const userData = localStorage.getItem('userData')
  if (userData && JSON.parse(userData).isAuthenticated) {
    router.push('/itinerary')
  } else {
    router.push('/signup')
  }
}

// Function to navigate to itinerary with destination parameter
const navigateToItineraryWithDestination = (destination) => {
  const userData = localStorage.getItem('userData')
  if (userData && JSON.parse(userData).isAuthenticated) {
    router.push({
      path: '/itinerary',
      query: { destination }
    })
  } else {
    router.push('/signup')
  }
}

// Function to navigate to guides page with authentication check
const navigateToGuides = () => {
  const userData = localStorage.getItem('userData')
  if (userData && JSON.parse(userData).isAuthenticated) {
    router.push('/guides')
  } else {
    router.push('/signup')
  }
}

// Function to navigate to culture page with authentication check
const navigateToCulture = () => {
  const userData = localStorage.getItem('userData')
  if (userData && JSON.parse(userData).isAuthenticated) {
    router.push('/culture')
  } else {
    router.push('/signup')
  }
}

const indianDestinations = [
  'Agra', 'Jaipur', 'Varanasi', 'Delhi', 'Mumbai', 
  'Udaipur', 'Goa', 'Kerala', 'Amritsar', 'Rishikesh'
]

const culturalInterests = [
  { id: 'food', name: 'Culinary Arts', description: 'Local cuisine, cooking classes, and food markets' },
  { id: 'history', name: 'Historical Sites', description: 'Monuments, temples, and archaeological sites' },
  { id: 'arts', name: 'Traditional Arts', description: 'Music, dance, and visual arts' },
  { id: 'festivals', name: 'Festivals & Ceremonies', description: 'Local celebrations and traditional ceremonies' },
  { id: 'crafts', name: 'Traditional Crafts', description: 'Artisan workshops and traditional craftsmanship' }
]

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    image: 'https://randomuser.me/api/portraits/women/32.jpg',
    text: 'The cultural itinerary created for my trip to Rajasthan was incredible! I experienced authentic local traditions, connected with amazing guides, and discovered hidden gems I would have never found on my own.',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Chen',
    image: 'https://randomuser.me/api/portraits/men/44.jpg',
    text: 'The local cooking classes in Kerala were a highlight of my trip. I learned so much about traditional spices and techniques!',
    rating: 5
  },
  {
    id: 3,
    name: 'Emma Wilson',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    text: 'Visiting the temples in Varanasi with a knowledgeable guide made the experience so much more meaningful. Highly recommended!',
    rating: 5
  }
]

const nextTestimonial = () => {
  currentTestimonialIndex.value = (currentTestimonialIndex.value + 1) % testimonials.length
}

const previousTestimonial = () => {
  currentTestimonialIndex.value = currentTestimonialIndex.value === 0 
    ? testimonials.length - 1 
    : currentTestimonialIndex.value - 1
}

const featuredDestinations = [
  {
    name: 'Taj Mahal, Agra',
    description: 'The iconic marble mausoleum and UNESCO World Heritage site',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80'
  },
  {
    name: 'Hawa Mahal, Jaipur',
    description: 'The stunning "Palace of Winds" in the Pink City',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    name: 'Varanasi Ghats',
    description: 'Experience the spiritual heart of India along the Ganges River',
    image: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    name: 'Golden Temple, Amritsar',
    description: 'The holiest gurdwara and spiritual center of Sikhism',
    image: 'https://images.unsplash.com/photo-1609947017136-9daf32a5eb16?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Backwaters of Kerala',
    description: 'Serene network of canals, lakes and lagoons',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80'
  },
  {
    name: 'Mehrangarh Fort, Jodhpur',
    description: 'One of the largest forts in India with stunning views of the Blue City',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
  }
]

const features = [
  {
    emoji: '🍛',
    emojis: ['🍛', '🫔', '🥘', '🍜', '🥗', '🫕', '🍲', '🥪'],
    title: 'Culinary Journeys',
    description: 'Discover the diverse flavors of Indian cuisine through cooking classes, food tours, and dining with local families.'
  },
  {
    emoji: '🕌',
    emojis: ['🕌', '🏰', '🏛️', '⛩️', '🏺', '🗿', '🏮', '🎎'],
    title: 'Historical Wonders',
    description: 'Explore ancient temples, majestic forts, and architectural marvels with expert historical context.'
  },
  {
    emoji: '💃',
    emojis: ['💃', '🎭', '🎨', '🎪', '🎵', '🎶', '🎸', '🥁'],
    title: 'Arts & Performances',
    description: 'Experience traditional dance forms, music concerts, and artistic expressions unique to each region.'
  },
  {
    emoji: '🎨',
    emojis: ['🎨', '🖼️', '🧶', '🪴', '🎭', '🪘', '📿', '🧺'],
    title: 'Traditional Crafts',
    description: 'Learn traditional art forms like block printing, pottery, and textile weaving from master artisans.'
  },
  {
    emoji: '🏺',
    emojis: ['🏺', '🏰', '🛕', '🏯', '🎪', '🪔', '🎎', '👑'],
    title: 'Heritage Stays',
    description: 'Experience royal hospitality in heritage hotels and traditional homestays.'
  },
  {
    emoji: '🙏',
    emojis: ['🙏', '🕉️', '☸️', '✨', '🕯️', '📿', '🪔', '🎋'],
    title: 'Spiritual Experiences',
    description: 'Participate in traditional ceremonies, meditation sessions, and spiritual retreats.'
  }
]

const upcomingEvents = [
  {
    name: 'Diwali Festival of Lights',
    date: 'Oct 31 - Nov 4',
    location: 'Nationwide, especially Jaipur & Varanasi',
    description: 'Experience India\'s most important festival with stunning light displays, fireworks, and traditional ceremonies.',
    category: 'Religious Festival',
    image: 'https://plus.unsplash.com/premium_photo-1729038870035-3a13f7c14257?q=80&w=2129&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Pushkar Camel Fair',
    date: 'Nov 11 - Nov 19',
    location: 'Pushkar, Rajasthan',
    description: 'One of the world\'s largest camel fairs, featuring trading, races, cultural performances, and more.',
    category: 'Cultural Fair',
    image: 'https://plus.unsplash.com/premium_photo-1661962667200-24712e1a5b0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Kochi-Muziris Biennale',
    date: 'Dec 12 - Apr 10',
    location: 'Fort Kochi, Kerala',
    description: 'India\'s largest contemporary art exhibition featuring installations by artists from around the world.',
    category: 'Art Festival',
    image: 'https://media.vogue.in/wp-content/uploads/2019/12/residency-1.jpg'
  }
]

const subscribeNewsletter = () => {
  if (newsletterEmail.value && newsletterEmail.value.includes('@')) {
    alert(`Thank you for subscribing with ${newsletterEmail.value}! You'll receive our latest cultural updates soon.`)
    newsletterEmail.value = ''
  } else {
    alert('Please enter a valid email address')
  }
}

// Function to show planning steps
const showPlanningSteps = () => {
  showHelpPanel.value = false
  showStepsDialog.value = true
}

// Function to start planning
const startPlanning = () => {
  showStepsDialog.value = false
  navigateToItinerary()
}

// Function to show guide finding steps
const showGuideFindingSteps = () => {
  showHelpPanel.value = false
  showGuideDialog.value = true
}

// Function to start finding a guide
const startFindingGuide = () => {
  showGuideDialog.value = false
  navigateToGuides()
}

// Function to show cultural tips steps
const showCulturalTipsSteps = () => {
  showHelpPanel.value = false
  showCulturalTipsDialog.value = true
}

// Function to start cultural planning
const startCulturalPlanning = () => {
  showCulturalTipsDialog.value = false
  navigateToItinerary()
}

// Function to handle clicking outside
const handleClickOutside = (event) => {
  const helpPanel = document.querySelector('.help-panel')
  const helpButton = document.querySelector('.help-button')
  
  if (helpPanel && !helpPanel.contains(event.target) && 
      helpButton && !helpButton.contains(event.target)) {
    closeHelpPanel()
  }
}

// Function to close help panel
const closeHelpPanel = () => {
  showHelpPanel.value = false
  activeDialog.value = null
}

// Function to toggle help panel
const toggleHelpPanel = () => {
  if (showHelpPanel.value) {
    closeHelpPanel()
  } else {
    showHelpPanel.value = true
    activeDialog.value = null
  }
}

// Function to open specific dialog
const openDialog = (dialogType) => {
  // Close all dialogs first
  showStepsDialog.value = false
  showGuideDialog.value = false
  showCulturalTipsDialog.value = false
  showContactDialog.value = false
  showAIDialog.value = false
  
  // Set the active dialog
  activeDialog.value = dialogType
  showHelpPanel.value = false
  
  // Open the requested dialog
  switch (dialogType) {
    case 'planning':
      showStepsDialog.value = true
      break
    case 'guide':
      showGuideDialog.value = true
      break
    case 'cultural':
      showCulturalTipsDialog.value = true
      break
    case 'contact':
      showContactDialog.value = true
      break
    case 'ai':
      showAIDialog.value = true
      break
  }
}

// Close all dialogs
const closeAllDialogs = () => {
  showContactDialog.value = false
  showCulturalTipsDialog.value = false
  showAIDialog.value = false
  activeDialog.value = null
}

const handleEscapeKey = (event) => {
  if (event.key === 'Escape') {
    closeAllDialogs()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscapeKey)
})
</script>

<style scoped>
.cultural-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.cultural-emoji {
  font-size: 2.5rem;
  animation: float-rotate var(--duration, 4s) infinite;
  animation-delay: var(--delay, 0s);
  transform-origin: center;
  display: inline-block;
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.1));
}

@keyframes float-rotate {
  0% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) scale(1.1) rotate(5deg);
  }
  50% {
    transform: translateY(0) scale(1.2) rotate(0deg);
  }
  75% {
    transform: translateY(10px) scale(1.1) rotate(-5deg);
  }
  100% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
}

/* Add hover effect for the container */
.group:hover .cultural-emoji {
  animation-duration: 2s;
}
</style> 