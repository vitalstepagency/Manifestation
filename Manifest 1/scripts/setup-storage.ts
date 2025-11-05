/**
 * Setup Script: Create Supabase Storage Bucket
 *
 * Run this once to create the manifestation-images bucket
 * Usage: npx tsx scripts/setup-storage.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  console.log('🚀 Setting up Supabase Storage...\n');

  try {
    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error('❌ Error listing buckets:', listError);
      return;
    }

    const bucketExists = buckets?.some(b => b.name === 'manifestation-images');

    if (bucketExists) {
      console.log('✅ Bucket "manifestation-images" already exists');
      return;
    }

    // Create the bucket
    console.log('📦 Creating bucket "manifestation-images"...');
    const { data: bucket, error: createError } = await supabase.storage.createBucket('manifestation-images', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    });

    if (createError) {
      console.error('❌ Error creating bucket:', createError);
      return;
    }

    console.log('✅ Bucket created successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Go to Supabase Dashboard → Storage → manifestation-images');
    console.log('2. Make sure the bucket is set to "Public"');
    console.log('3. Set up storage policies if needed');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupStorage();
