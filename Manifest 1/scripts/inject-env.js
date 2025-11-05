#!/usr/bin/env node

/**
 * This script creates a runtime config file from Vercel environment variables
 * Run this BEFORE the Vite build to ensure env vars are available
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Injecting environment variables...');

const envVars = {
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
  VITE_UNSPLASH_ACCESS_KEY: process.env.VITE_UNSPLASH_ACCESS_KEY,
};

// Check which variables are set
Object.entries(envVars).forEach(([key, value]) => {
  if (value) {
    console.log(`✅ ${key}: SET`);
  } else {
    console.log(`❌ ${key}: MISSING`);
  }
});

// Create .env.production file for Vite to read
const envContent = Object.entries(envVars)
  .filter(([_, value]) => value)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

const envPath = path.join(__dirname, '..', '.env.production');
fs.writeFileSync(envPath, envContent, 'utf8');

console.log(`✅ Created ${envPath}`);
console.log('📦 Environment variables injected successfully!');
