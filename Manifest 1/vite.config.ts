import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';

// Debug: Log environment variables during build
console.log('🔍 Vite Build Environment Variables:');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '✅ SET (' + process.env.VITE_SUPABASE_URL.substring(0, 20) + '...)' : '❌ MISSING');
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? '✅ SET (' + process.env.VITE_SUPABASE_ANON_KEY.substring(0, 20) + '...)' : '❌ MISSING');
console.log('VITE_UNSPLASH_ACCESS_KEY:', process.env.VITE_UNSPLASH_ACCESS_KEY ? '✅ SET (' + process.env.VITE_UNSPLASH_ACCESS_KEY.substring(0, 20) + '...)' : '❌ MISSING');

// https://vite.dev/config/
export default defineConfig({
  define: {
    // Explicitly inline environment variables from process.env into the bundle
    __VITE_SUPABASE_URL__: JSON.stringify(process.env.VITE_SUPABASE_URL),
    __VITE_SUPABASE_ANON_KEY__: JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
    __VITE_UNSPLASH_ACCESS_KEY__: JSON.stringify(process.env.VITE_UNSPLASH_ACCESS_KEY),
  },
  build: {
    sourcemap: 'hidden',
  },
  server: {
    hmr: {
      overlay: false, // Disable error overlay to prevent HTML proxy errors
    },
  },
  optimizeDeps: {
    include: [
      'gsap',
      'gsap/ScrollTrigger',
      '@react-three/fiber',
      '@react-three/drei',
      '@react-three/postprocessing',
      'three',
      'react-spring',
      '@use-gesture/react',
      'lottie-react',
      '@lottiefiles/react-lottie-player',
      '@gsap/react',
      'leva'
    ]
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root'
    }),
    tsconfigPaths()
  ],
})
