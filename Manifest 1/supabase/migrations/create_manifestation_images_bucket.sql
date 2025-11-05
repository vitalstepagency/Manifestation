-- Create storage bucket for manifestation images
-- Users can upload personal photos for their dreams

-- Create the bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'manifestation-images',
  'manifestation-images',
  true, -- Public bucket
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Allow authenticated users to upload images to their own folder
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'manifestation-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to view their own images
CREATE POLICY "Users can view their own images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'manifestation-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'manifestation-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public access to view images (for sharing manifestations)
CREATE POLICY "Anyone can view public images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'manifestation-images');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_objects_bucket_id
  ON storage.objects(bucket_id);

CREATE INDEX IF NOT EXISTS idx_objects_name
  ON storage.objects(name);
