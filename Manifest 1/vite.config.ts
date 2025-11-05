import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';

// https://vite.dev/config/
export default defineConfig({
  define: {
    // Explicitly expose environment variables for production builds
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
    'import.meta.env.VITE_UNSPLASH_ACCESS_KEY': JSON.stringify(process.env.VITE_UNSPLASH_ACCESS_KEY),
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
