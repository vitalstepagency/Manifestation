import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";
import ImageBillboard from "./ImageBillboard";

interface VisualizationRendererProps {
  type: "image" | "icon" | "sphere";
  source?: string; // image URL or icon/emoji
  color: string;
  size: number; // width/height for images, radius for spheres
  progress: number; // 0-100
  position: [number, number, number];
  isSelected?: boolean;
  isHovered?: boolean;
}

/**
 * VisualizationRenderer - Adaptive dream visualization
 *
 * Modes:
 * - image: Billboard plane with texture (always faces camera)
 * - icon: Large emoji/icon display with glow
 * - sphere: Fallback colored sphere
 *
 * Features:
 * - Scales with progress
 * - Subtle float animation
 * - Billboard effect for images/icons
 */
export default function VisualizationRenderer({
  type,
  source,
  color,
  size,
  progress,
  position,
  isSelected = false,
  isHovered = false,
}: VisualizationRendererProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Calculate scale based on progress (0.8x at 0%, 1.3x at 100%)
  const progressScale = 0.8 + (progress / 100) * 0.5;
  const hoverScale = isHovered || isSelected ? 1.2 : 1;
  const finalScale = progressScale * hoverScale;

  // Float animation
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Gentle floating up and down
    const floatOffset = Math.sin(time * 0.8) * 0.15;
    groupRef.current.position.y = position[1] + floatOffset;

    // Subtle rotation for spheres
    if (type === "sphere" && meshRef.current) {
      meshRef.current.rotation.y = time * 0.3;
    }
  });

  // Render based on type
  const renderVisualization = () => {
    switch (type) {
      case "image":
        // Use ImageBillboard component for texture loading
        if (source) {
          return (
            <ImageBillboard
              imageUrl={source}
              size={size}
              scale={finalScale}
              color={color}
            />
          );
        }
        // Fallback to colored plane if no source
        return (
          <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
            <mesh ref={meshRef} scale={finalScale}>
              <planeGeometry args={[size, size]} />
              <meshBasicMaterial color={color} transparent opacity={0.4} />
            </mesh>
          </Billboard>
        );

      case "icon":
        return (
          <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
            <group scale={finalScale}>
              {/* Icon/Emoji text - LARGER with white glow */}
              <Text
                fontSize={size * 0.8}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                outlineWidth={size * 0.04}
                outlineColor="#ffffff"
              >
                {source || "⭐"}
              </Text>
              {/* White glow halo for visibility */}
              <mesh position={[0, 0, -0.05]}>
                <circleGeometry args={[size * 0.7, 32]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
              </mesh>
              {/* Colored glow background */}
              <mesh position={[0, 0, -0.1]}>
                <circleGeometry args={[size * 0.65, 32]} />
                <meshBasicMaterial color={color} transparent opacity={0.5} />
              </mesh>
            </group>
          </Billboard>
        );

      case "sphere":
      default:
        return (
          <mesh ref={meshRef} scale={finalScale}>
            <sphereGeometry args={[size * 0.5, 32, 32]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isHovered || isSelected ? 1.5 : 0.8}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        );
    }
  };

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      {renderVisualization()}

      {/* Point light for glow */}
      <pointLight
        position={[0, 0, 0]}
        color={color}
        intensity={0.8 * finalScale}
        distance={size * 4}
      />
    </group>
  );
}
