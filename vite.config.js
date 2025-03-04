import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      strategies: 'generateSW',
      registerType: 'prompt',
      includeAssets: ['/icons/yatrasangamlogo.png'],
      manifest: {
        name: 'YatraSangam',
        short_name: 'YatraSangam',
        description: 'Your Cultural Travel Companion',
        theme_color: '#4F46E5',
        start_url: '/',
        id: '/',
        display: 'standalone',
        background_color: '#ffffff',
        icons: [
          {
            src: '/icons/yatrasangamlogo.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: '/icons/yatrasangamlogo.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: '/icons/yatrasangamlogo.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: '/icons/yatrasangamlogo.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: '/icons/yatrasangamlogo.png',
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: '/icons/yatrasangamlogo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/yatrasangamlogo.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: '/icons/yatrasangamlogo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        sourcemap: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true
  }
}) 