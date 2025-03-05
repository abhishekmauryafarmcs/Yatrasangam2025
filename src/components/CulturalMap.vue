<template>
  <div class="map-container">
    <!-- Map container is always rendered but may be hidden -->
    <div ref="mapRef" id="map" class="h-full w-full rounded-lg"></div>
    
    <!-- Overlay for loading and errors -->
    <div v-if="error || loading" class="map-overlay">
      <div v-if="error" class="text-center p-4">
        <p class="text-red-600 mb-2">{{ error }}</p>
        <button @click="retryLoading" class="text-indigo-600 hover:text-indigo-800">
          Retry Loading Map
        </button>
        <div class="mt-2 text-xs text-gray-500">
          Technical details: {{ debugInfo }}
        </div>
      </div>
      <div v-else-if="loading" class="text-center">
        <p class="text-gray-600">Loading map... <span v-if="loadingStatus">{{ loadingStatus }}</span></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue';

// Import Leaflet CSS directly in the component
const props = defineProps({
  destinations: {
    type: Array,
    required: true,
    default: () => []
  }
});

const mapRef = ref(null);
const error = ref(null);
const loading = ref(true);
const loadingStatus = ref('');
const debugInfo = ref('');
let map = null;
let markers = [];
let L = null;
let initializationAttempted = false;

// Create a marker icon once Leaflet is loaded
const createMarkerIcon = (isSelected = false) => {
  return L.icon({
    iconUrl: isSelected 
      ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
      : 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: isSelected 
      ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
      : 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: isSelected ? [35, 57] : [25, 41], // Larger size for selected marker
    iconAnchor: isSelected ? [17, 57] : [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Function to check container dimensions
const checkContainerDimensions = () => {
  if (!mapRef.value) {
    console.error("Map reference is null");
    return null;
  }
  
  const mapElement = mapRef.value;
  const mapRect = mapElement.getBoundingClientRect();
  console.log("Checking map element dimensions:", mapRect);
  
  // Force dimensions if they're zero
  if (mapRect.width === 0 || mapRect.height === 0) {
    console.log("Forcing map container dimensions");
    mapElement.style.width = '100%';
    mapElement.style.height = '384px'; // 24rem = 384px
    
    // Check again after forcing dimensions
    const newRect = mapElement.getBoundingClientRect();
    console.log("New dimensions after forcing:", newRect);
    
    return newRect.width > 0 && newRect.height > 0 ? newRect : null;
  }
  
  return mapRect.width > 0 && mapRect.height > 0 ? mapRect : null;
};

// Initialize the map
const initMap = async () => {
  console.log("Starting map initialization");
  
  if (initializationAttempted) {
    console.log("Map initialization already attempted, skipping");
    return;
  }
  
  initializationAttempted = true;
  loading.value = true;
  error.value = null;
  
  try {
    // Ensure Leaflet is loaded
    if (!window.L) {
      await loadLeaflet();
    }
    L = window.L;
    
    // Wait for container dimensions
    loadingStatus.value = "Preparing map container...";
    
    // Force a layout reflow
    document.body.offsetHeight;
    
    // Wait for dimensions with a longer timeout
    const dimensions = await waitForDimensions(20);
    
    if (!dimensions) {
      throw new Error("Could not get container dimensions after multiple attempts");
    }
    
    // Create map instance
    loadingStatus.value = "Creating map...";
    const defaultCenter = [20.5937, 78.9629];
    let center = props.destinations.length > 0 && props.destinations[0]?.coordinates
      ? [props.destinations[0].coordinates.lat, props.destinations[0].coordinates.lng]
      : defaultCenter;
    
    console.log("Creating map with center:", center);
    map = L.map(mapRef.value, {
      center: center,
      zoom: 5
    });
    
    // Add tile layer
    loadingStatus.value = "Loading map tiles...";
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map);
    
    // Add markers
    loadingStatus.value = "Adding markers...";
    await updateMarkers();
    
    // Force a map resize to ensure it renders correctly
    setTimeout(() => {
      if (map) {
        console.log("Forcing map invalidate size");
        map.invalidateSize();
      }
    }, 100);
    
    loading.value = false;
    console.log("Map initialization complete");
  } catch (err) {
    console.error('Error initializing map:', err);
    debugInfo.value = err.message;
    error.value = "Failed to initialize map. Please try again.";
    loading.value = false;
  }
};

// Load Leaflet library
const loadLeaflet = async () => {
  // Load CSS
  if (!document.querySelector('link[href*="leaflet.css"]')) {
    console.log("Loading Leaflet CSS");
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }
  
  // Load JS
  if (!window.L) {
    console.log("Loading Leaflet JS");
    loadingStatus.value = "Loading map library...";
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        console.log("Leaflet script loaded successfully");
        resolve();
      };
      script.onerror = (err) => {
        console.error("Error loading Leaflet script:", err);
        reject(new Error("Failed to load Leaflet library"));
      };
      document.head.appendChild(script);
    });
  }
  
  return Promise.resolve();
};

// Function to wait for container dimensions
const waitForDimensions = async (maxAttempts = 10) => {
  for (let i = 0; i < maxAttempts; i++) {
    const dimensions = checkContainerDimensions();
    if (dimensions) {
      console.log("Container dimensions found:", dimensions);
      return dimensions;
    }
    console.log(`Attempt ${i + 1}/${maxAttempts}: Waiting for container dimensions...`);
    await new Promise(resolve => setTimeout(resolve, 200)); // Longer timeout
  }
  return null;
};

// Retry loading the map
const retryLoading = () => {
  loading.value = true;
  error.value = null;
  debugInfo.value = "";
  initializationAttempted = false;
  
  // Force a layout reflow
  if (mapRef.value) {
    mapRef.value.style.display = 'none';
    document.body.offsetHeight; // Force reflow
    mapRef.value.style.display = 'block';
  }
  
  nextTick(() => {
    initMap();
  });
};

// Update markers when destinations change
const updateMarkers = async () => {
  if (!map || !L) {
    console.error("Cannot update markers: map or L is not initialized");
    return;
  }
  
  // Clear existing markers
  markers.forEach(marker => marker.remove());
  markers = [];
  
  if (props.destinations.length === 0) {
    console.log("No destinations to add markers for");
    return;
  }
  
  console.log("Adding markers for destinations:", props.destinations);
  
  try {
    // Add new markers
    props.destinations.forEach((destination, index) => {
      if (!destination.coordinates) {
        console.warn("Destination missing coordinates:", destination);
        return;
      }
      
      // First destination is considered the selected/primary one
      const isSelected = index === 0;
      const icon = createMarkerIcon(isSelected);
      
      const marker = L.marker(
        [destination.coordinates.lat, destination.coordinates.lng],
        { icon }
      ).addTo(map);
      
      // Create a custom popup with bold title for selected location
      const popupContent = `
        <div class="p-2">
          <h3 class="${isSelected ? 'font-bold text-lg text-red-600' : 'font-bold'}">${destination.name}</h3>
          ${destination.description ? `<p class="text-sm mt-1">${destination.description}</p>` : ''}
          ${isSelected ? '<p class="text-xs mt-1 font-semibold text-gray-600">Selected Location</p>' : ''}
        </div>
      `;
      
      marker.bindPopup(popupContent, {
        className: isSelected ? 'selected-popup' : ''
      });
      
      // Auto-open popup for selected location
      if (isSelected) {
        setTimeout(() => marker.openPopup(), 500);
      }
      
      markers.push(marker);
    });
    
    // Adjust map view
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds());
      if (markers.length === 1) {
        map.setZoom(12);
      }
    }
  } catch (err) {
    console.error("Error updating markers:", err);
    throw err;
  }
};

// Watch for changes in destinations
watch(() => props.destinations, async (newDestinations) => {
  console.log("Destinations changed:", newDestinations);
  
  if (newDestinations.length > 0) {
    if (!map || !L) {
      // If we have destinations but no map, try initializing again
      console.log("Have destinations but no map, attempting initialization");
      await initMap();
    } else {
      updateMarkers();
    }
  }
}, { deep: true, immediate: true });

// Clean up on component unmount
onUnmounted(() => {
  console.log("Component unmounting");
  if (map) {
    markers.forEach(marker => marker.remove());
    markers = [];
    map.remove();
    map = null;
  }
});

onMounted(async () => {
  console.log("Component mounted");
  
  // Load Leaflet first
  try {
    await loadLeaflet();
  } catch (err) {
    error.value = "Failed to load map library. Please check your internet connection.";
    loading.value = false;
    return;
  }
  
  // Wait for next tick to ensure DOM is ready
  await nextTick();
  
  // Force a layout reflow
  document.body.offsetHeight;
  
  // Wait for initial destinations
  if (props.destinations.length > 0) {
    await initMap();
  } else {
    console.log("Waiting for destinations before initializing map");
  }
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 384px; /* 24rem = 384px */
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

#map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(243, 244, 246, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  border-radius: 0.5rem;
}

/* Leaflet popup styles */
:deep(.leaflet-popup-content-wrapper) {
  padding: 0;
}

:deep(.leaflet-popup-content) {
  margin: 0;
  line-height: 1.4;
}

/* Selected popup styles */
:deep(.selected-popup .leaflet-popup-content-wrapper) {
  border-left: 4px solid #dc2626;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.selected-popup .leaflet-popup-tip) {
  background-color: #fee2e2;
}

:deep(.selected-popup .leaflet-popup-content) {
  font-weight: 500;
}
</style> 