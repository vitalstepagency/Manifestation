/**
 * Unsplash Image Service
 *
 * Fetches high-quality images from Unsplash API for dream visualization
 * Uses Unsplash Source API (no auth required for MVP)
 */

export interface UnsplashImage {
  id: string;
  url: string;
  downloadUrl: string;
  thumbnailUrl: string;
  photographer: string;
  photographerUrl: string;
  width: number;
  height: number;
}

/**
 * Search for images matching a query
 * FIXED: Using Lorem Picsum (free, no auth) + Unsplash API fallback
 *
 * TODO: Add proper Unsplash API key for production
 */
export async function searchUnsplashImages(
  query: string,
  count: number = 9
): Promise<UnsplashImage[]> {
  try {
    console.log(`🔍 Searching for images: "${query}"`);

    // TRY 1: Official Unsplash API (if we have a key)
    const unsplashKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

    if (unsplashKey) {
      console.log(`🔑 Unsplash API key found, using real search for: "${query}"`);

      try {
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=squarish`;
        console.log(`📡 Fetching from Unsplash:`, url);

        const response = await fetch(url, {
          headers: {
            'Authorization': `Client-ID ${unsplashKey}`
          }
        });

        console.log(`📥 Unsplash API response status:`, response.status);

        if (response.ok) {
          const data = await response.json();
          console.log(`📊 Unsplash returned ${data.results?.length || 0} results`);

          if (!data.results || data.results.length === 0) {
            console.warn(`⚠️ Unsplash returned no results for "${query}", using fallback`);
            // Fall through to fallback
          } else {
            const images = data.results.map((img: any) => ({
              id: img.id,
              url: img.urls.regular,
              downloadUrl: img.urls.full,
              thumbnailUrl: img.urls.small,
              photographer: img.user.name,
              photographerUrl: img.user.links.html,
              width: img.width,
              height: img.height
            }));

            console.log(`✅ Successfully fetched ${images.length} RELEVANT Unsplash images for "${query}"`);
            console.log(`🎯 Sample image:`, images[0]?.url);
            return images;
          }
        } else {
          const errorText = await response.text();
          console.error(`❌ Unsplash API error ${response.status}:`, errorText);
        }
      } catch (error) {
        console.error('❌ Unsplash API failed:', error);
      }
    } else {
      console.warn('⚠️ No Unsplash API key found in env');
    }

    // EMERGENCY FALLBACK: Only if Unsplash completely fails
    // This should NEVER happen in production with a valid API key
    console.error(`🚨 CRITICAL: Unsplash API failed for "${query}"`);
    console.error('⚠️ Using generic fallback - USER EXPERIENCE DEGRADED');
    console.error('💡 Add VITE_UNSPLASH_ACCESS_KEY to .env to fix this');

    const images: UnsplashImage[] = [];

    for (let i = 0; i < count; i++) {
      const imageId = Math.floor(Math.random() * 1000) + 1;
      const seed = Date.now() + i;

      images.push({
        id: `fallback-${imageId}-${seed}`,
        url: `https://picsum.photos/id/${imageId}/800/800`,
        downloadUrl: `https://picsum.photos/id/${imageId}/800/800`,
        thumbnailUrl: `https://picsum.photos/id/${imageId}/400/400`,
        photographer: 'Fallback',
        photographerUrl: 'https://picsum.photos',
        width: 800,
        height: 800
      });
    }

    console.warn(`⚠️ Returned ${images.length} generic fallback images (NOT SEARCH-RELEVANT)`);
    return images;

  } catch (error) {
    console.error('❌ Image search failed:', error);
    return [];
  }
}

/**
 * Get a single random image for a category
 * FIXED: Using Lorem Picsum instead of deprecated Unsplash Source
 */
export function getRandomImageUrl(category: string, size: number = 800): string {
  const imageId = Math.floor(Math.random() * 1000) + 1;
  return `https://picsum.photos/id/${imageId}/${size}/${size}`;
}

/**
 * Get optimized image URL for different use cases
 */
export function getOptimizedImageUrl(
  baseUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
  } = {}
): string {
  const { width = 800, height = 800, quality = 80 } = options;

  // If it's an Unsplash Source URL, just return it (already optimized)
  if (baseUrl.includes('source.unsplash.com')) {
    return baseUrl;
  }

  // For other URLs, return as-is (could add Cloudinary/imgix in production)
  return baseUrl;
}

/**
 * Category-specific search terms for better image results
 */
export const CATEGORY_SEARCH_TERMS: Record<string, string> = {
  vehicle: 'luxury car automobile',
  home: 'modern house architecture',
  travel: 'travel destination landscape',
  wealth: 'success luxury lifestyle',
  love: 'love relationship couple',
  health: 'fitness health wellness',
  other: 'inspiration motivation'
};

/**
 * Get search term for a category
 */
export function getCategorySearchTerm(category: string): string {
  return CATEGORY_SEARCH_TERMS[category] || category;
}
