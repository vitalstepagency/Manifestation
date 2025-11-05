import { useState } from 'react';
import { Text } from '@react-three/drei';
import DreamPlatform from './DreamPlatform';
import VisualizationRenderer from './VisualizationRenderer';

interface Dream {
  id: string;
  title: string;
  type: 'dream' | 'goal' | 'milestone' | 'habit';
  color: string;
  progress: number; // 0-100
  imageUrl?: string;
  icon?: string; // emoji or icon
  category?: 'vehicle' | 'home' | 'travel' | 'wealth' | 'love' | 'health' | 'other';
  isMainGoal?: boolean;
}

interface DreamNodeProps {
  dream: Dream;
  position: [number, number, number];
  isSelected?: boolean;
  onSelect: (dreamId: string) => void;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/**
 * DreamNode - Complete adaptive dream visualization
 *
 * Combines:
 * - DreamPlatform (glowing base + progress ring)
 * - VisualizationRenderer (image/icon/sphere)
 * - Text labels (title + progress)
 *
 * Sizing:
 * - Main goal: Platform 1.5, Visual 3x3
 * - Regular dreams: Platform 0.8-1.0, Visual 1.5x2
 */
export default function DreamNode({
  dream,
  position,
  isSelected = false,
  onSelect,
  onClick,
  onPointerOver,
  onPointerOut
}: DreamNodeProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine sizing based on dream type
  // Main goal: MUCH larger for prominence (2x bigger)
  // Regular dreams: Standard size
  const isMainGoal = dream.isMainGoal || dream.type === 'goal';
  const platformSize = isMainGoal ? 2.0 : 1.0;
  const visualSize = isMainGoal ? 4.0 : 2.0;

  // Determine visualization type and source
  const getVisualizationType = (): 'image' | 'icon' | 'sphere' => {
    if (dream.imageUrl) return 'image';
    if (dream.icon) return 'icon';
    return 'icon'; // Default to icon with category emoji
  };

  const getVisualizationSource = (): string => {
    if (dream.icon) return dream.icon;

    // Category-based emoji fallback (MVP)
    const categoryIcons: Record<string, string> = {
      vehicle: '🚗',
      home: '🏠',
      travel: '✈️',
      wealth: '💰',
      love: '❤️',
      health: '💪',
      other: '⭐'
    };

    return categoryIcons[dream.category || 'other'] || '⭐';
  };

  const handlePointerOver = () => {
    setIsHovered(true);
    onPointerOver?.();
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    onPointerOut?.();
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    onSelect(dream.id);
    onClick?.();
  };

  return (
    <group position={position}>
      {/* Click/hover detection mesh (invisible) */}
      <mesh
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        position={[0, visualSize * 0.3, 0]}
      >
        <boxGeometry args={[visualSize * 1.2, visualSize * 1.5, visualSize * 1.2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Platform at base */}
      <DreamPlatform
        progress={dream.progress}
        color={dream.color}
        size={platformSize}
        position={[0, 0, 0]}
        isSelected={isSelected}
        isHovered={isHovered}
      />

      {/* Visualization floating above platform */}
      <VisualizationRenderer
        type={getVisualizationType()}
        source={getVisualizationSource()}
        color={dream.color}
        size={visualSize}
        progress={dream.progress}
        position={[0, platformSize + visualSize * 0.5, 0]}
        isSelected={isSelected}
        isHovered={isHovered}
      />

      {/* Title label below platform */}
      <Text
        position={[0, -0.4, 0]}
        fontSize={isMainGoal ? 0.4 : 0.3}
        color="white"
        anchorX="center"
        anchorY="top"
        maxWidth={isMainGoal ? 6 : 4}
        textAlign="center"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {dream.title}
      </Text>

      {/* Progress percentage (shown when hovered or selected) */}
      {(isHovered || isSelected) && dream.progress > 0 && (
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.25}
          color={dream.color}
          anchorX="center"
          anchorY="top"
          outlineWidth={0.015}
          outlineColor="#000000"
        >
          {dream.progress}%
        </Text>
      )}

      {/* Main goal badge */}
      {isMainGoal && (
        <Text
          position={[0, platformSize + visualSize + 0.5, 0]}
          fontSize={0.3}
          color="#FFD700"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          ⭐ MAIN GOAL
        </Text>
      )}
    </group>
  );
}
