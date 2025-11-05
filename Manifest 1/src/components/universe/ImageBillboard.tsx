import { useRef, Suspense, useState, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';

interface ImageBillboardProps {
  imageUrl: string;
  size: number;
  scale: number;
  color: string;
}

/**
 * Check if string is an emoji (not a valid image URL)
 */
function isEmoji(str: string): boolean {
  // Basic emoji detection - single character or very short string without http/https
  if (!str) return false;
  if (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('data:')) {
    return false;
  }
  // If it's very short and doesn't look like a URL, treat as emoji
  return str.length <= 4;
}

/**
 * ImageBillboard - Loads and displays an image texture on a billboard plane
 *
 * Features:
 * - Async texture loading with Suspense
 * - Error handling with fallback
 * - Billboard effect (always faces camera)
 * - Rounded corners with glow
 * - EMOJI PROTECTION: Renders emojis as text, not textures
 */
function ImageContent({ imageUrl, size, scale, color }: ImageBillboardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [loadError, setLoadError] = useState(false);

  // CRITICAL: Check if this is an emoji before trying to load as texture
  const isEmojiString = isEmoji(imageUrl);

  useEffect(() => {
    if (isEmojiString) {
      console.warn(`⚠️ ImageBillboard: Received emoji "${imageUrl}" - rendering as text instead`);
    }
  }, [imageUrl, isEmojiString]);

  // If it's an emoji, render as text (DON'T try to load as texture)
  if (isEmojiString) {
    return (
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <group scale={scale}>
          <Text
            fontSize={size * 0.6}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={size * 0.03}
            outlineColor="#ffffff"
          >
            {imageUrl}
          </Text>
          {/* Glow background */}
          <mesh position={[0, 0, -0.1]}>
            <circleGeometry args={[size * 0.6, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.3} />
          </mesh>
        </group>
      </Billboard>
    );
  }

  // If we had a load error, show fallback
  if (loadError) {
    console.error(`❌ ImageBillboard: Failed to load image: ${imageUrl}`);
    return (
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <mesh scale={scale}>
          <planeGeometry args={[size, size]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
          />
        </mesh>
      </Billboard>
    );
  }

  // Try to load as texture (with error handling)
  try {
    const texture = useLoader(THREE.TextureLoader, imageUrl, undefined, (error) => {
      console.error(`❌ Texture load error for ${imageUrl}:`, error);
      setLoadError(true);
    });

    return (
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <mesh ref={meshRef} scale={scale}>
          {/* Main image plane */}
          <planeGeometry args={[size, size]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0.95}
            toneMapped={false}
          />

          {/* Glow outline */}
          <mesh position={[0, 0, -0.01]} scale={1.05}>
            <planeGeometry args={[size, size]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.3}
              side={THREE.BackSide}
            />
          </mesh>
        </mesh>
      </Billboard>
    );
  } catch (error) {
    console.error(`❌ ImageBillboard render error:`, error);
    setLoadError(true);
    return <LoadingFallback size={size} scale={scale} color={color} />;
  }
}

/**
 * Fallback content shown while image loads
 */
function LoadingFallback({ size, scale, color }: Omit<ImageBillboardProps, 'imageUrl'>) {
  return (
    <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
      <mesh scale={scale}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
        />
      </mesh>
    </Billboard>
  );
}

/**
 * Main component with Suspense boundary
 */
export default function ImageBillboard(props: ImageBillboardProps) {
  return (
    <Suspense fallback={<LoadingFallback {...props} />}>
      <ImageContent {...props} />
    </Suspense>
  );
}
