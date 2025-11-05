import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Upload, Sparkles, Link as LinkIcon, Loader2 } from 'lucide-react';
import { searchUnsplashImages, getRandomImageUrl, UnsplashImage } from '../../utils/unsplashService';
import { supabase } from '../../lib/supabase';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  onSelectEmoji: (emoji: string) => void;
  defaultSearchTerm: string;
  category: string;
  categoryIcon: string;
}

export default function ImagePickerModal({
  isOpen,
  onClose,
  onSelectImage,
  onSelectEmoji,
  defaultSearchTerm,
  category,
  categoryIcon
}: ImagePickerModalProps) {
  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [customUrl, setCustomUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Auto-search on mount and when search term changes
  useEffect(() => {
    if (!isOpen) return;

    const searchImages = async () => {
      if (!searchTerm.trim()) return;

      setIsLoading(true);
      try {
        const results = await searchUnsplashImages(searchTerm, 6);
        setImages(results);
      } catch (error) {
        console.error('Image search failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchImages, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, isOpen]);

  // Auto-search on open
  useEffect(() => {
    if (isOpen && defaultSearchTerm) {
      setSearchTerm(defaultSearchTerm);
    }
  }, [isOpen, defaultSearchTerm]);

  const handleSelectImage = (imageUrl: string) => {
    onSelectImage(imageUrl);
    onClose();
  };

  const handleUseEmoji = () => {
    onSelectEmoji(categoryIcon);
    onClose();
  };

  const handleCustomUrl = () => {
    if (customUrl.trim()) {
      handleSelectImage(customUrl);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset error
    setUploadError(null);

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file (PNG, JPG, GIF, etc.)');
      return;
    }

    setIsUploading(true);

    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('You must be logged in to upload images');
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      console.log('📤 Uploading image:', fileName);

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('manifestation-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(uploadError.message || 'Failed to upload image');
      }

      if (!data) {
        throw new Error('Upload succeeded but no data returned');
      }

      console.log('✅ Upload successful:', data.path);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('manifestation-images')
        .getPublicUrl(data.path);

      if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL');
      }

      console.log('🌐 Public URL:', urlData.publicUrl);

      // Use the uploaded image
      handleSelectImage(urlData.publicUrl);

    } catch (error: any) {
      console.error('❌ Upload failed:', error);
      setUploadError(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-gradient-to-br from-purple-900/90 to-pink-900/90 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-purple-500/30"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{categoryIcon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Choose Your Vision</h2>
                  <p className="text-white/60 text-sm">Pick an image that represents your dream</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for your dream image..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-white/60">
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <span>Finding inspiring images...</span>
                </div>
              </div>
            )}

            {/* Image Grid */}
            {!isLoading && images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {images.map((image, index) => (
                  <motion.button
                    key={image.id}
                    onClick={() => handleSelectImage(image.url)}
                    onMouseEnter={() => setSelectedImageIndex(index)}
                    onMouseLeave={() => setSelectedImageIndex(null)}
                    className={`relative aspect-square rounded-lg overflow-hidden group ${
                      selectedImageIndex === index ? 'ring-4 ring-purple-500' : ''
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={image.thumbnailUrl}
                      alt={`Dream visualization ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 left-2 right-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sparkles className="w-4 h-4 inline mr-1" />
                      Click to select
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading && images.length === 0 && searchTerm && (
              <div className="text-center py-12 text-white/60">
                <p>No images found. Try a different search term.</p>
              </div>
            )}

            {/* Custom URL Input */}
            <div className="mb-6">
              <label className="block text-white/80 text-sm mb-2">Or paste an image URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleCustomUrl}
                  disabled={!customUrl.trim()}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
                >
                  Use URL
                </button>
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-white/80 text-sm mb-2">Upload your own image</label>
              <label className={`flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border-2 border-dashed border-white/20 rounded-lg hover:bg-white/20 cursor-pointer transition-colors ${
                isUploading ? 'opacity-50 cursor-wait' : ''
              }`}>
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 text-white/60 animate-spin" />
                    <span className="text-white/60">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-white/60" />
                    <span className="text-white/60">Click to upload (PNG, JPG, GIF up to 5MB)</span>
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
              {uploadError && (
                <p className="mt-2 text-sm text-red-400">{uploadError}</p>
              )}
            </div>

            {/* Use Emoji Instead */}
            <button
              onClick={handleUseEmoji}
              className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white/60 hover:text-white transition-colors"
            >
              Skip images, use emoji {categoryIcon} instead
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
