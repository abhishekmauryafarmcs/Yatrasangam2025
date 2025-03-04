<template>
  <div class="map-container h-96 w-full">
    <div ref="mapRef" class="h-full w-full rounded-lg"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  destinations: {
    type: Array,
    required: true,
    default: () => []
  }
});

const mapRef = ref(null);
let map = null;
let markers = [];

// Initialize the map
const initMap = () => {
  if (!mapRef.value) return;

  // Default center on India if no destinations
  const defaultCenter = { lat: 20.5937, lng: 78.9629 };
  const center = props.destinations[0]?.coordinates || defaultCenter;

  map = new google.maps.Map(mapRef.value, {
    zoom: 5,
    center: center,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  });

  updateMarkers();
};

// Update markers when destinations change
const updateMarkers = () => {
  // Clear existing markers
  markers.forEach(marker => marker.setMap(null));
  markers = [];

  // Add new markers
  props.destinations.forEach(destination => {
    if (!destination.coordinates) return;

    const marker = new google.maps.Marker({
      position: destination.coordinates,
      map: map,
      title: destination.name,
      animation: google.maps.Animation.DROP
    });

    // Add info window
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="p-2">
          <h3 class="font-bold">${destination.name}</h3>
          ${destination.description ? `<p class="text-sm mt-1">${destination.description}</p>` : ''}
        </div>
      `
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    markers.push(marker);
  });

  // Adjust map bounds to show all markers if there are any
  if (markers.length > 0) {
    const bounds = new google.maps.LatLngBounds();
    markers.forEach(marker => bounds.extend(marker.getPosition()));
    map.fitBounds(bounds);
    
    // If only one marker, zoom out a bit
    if (markers.length === 1) {
      map.setZoom(12);
    }
  }
};

// Load Google Maps script
const loadGoogleMapsScript = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('Google Maps API key is missing');
    return;
  }

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
  script.async = true;
  script.defer = true;
  script.onload = initMap;
  document.head.appendChild(script);
};

// Watch for changes in destinations
watch(() => props.destinations, () => {
  if (map) {
    updateMarkers();
  }
}, { deep: true });

onMounted(() => {
  loadGoogleMapsScript();
});
</script>

<style scoped>
.map-container {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
</style> 