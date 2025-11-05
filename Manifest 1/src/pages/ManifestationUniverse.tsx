/**
 * ManifestationUniverse - The Revolutionary Core Feature
 *
 * Users place their dreams in 3D space
 * Dreams glow brighter with progress
 * Energy flows between connected goals
 * Daily actions move dreams closer to reality
 */

import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Environment, Text, Line } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useManifestStore } from '../store/useManifestStore';
import type { ManifestationNode } from '../types';
import { toast } from 'sonner';
import StarfieldBackground from '../components/universe/StarfieldBackground';
import DreamNode from '../components/universe/DreamNode';
import CameraController from '../components/universe/CameraController';
import ImagePickerModal from '../components/universe/ImagePickerModal';
import { getCategorySearchTerm, searchUnsplashImages } from '../utils/unsplashService';

// ============================================================================
// TYPES
// ============================================================================

interface UniverseNode {
  id: string;
  type: 'dream' | 'goal' | 'milestone' | 'habit';
  title: string;
  description?: string;
  imageUrl?: string;
  icon?: string; // Emoji or icon for visualization
  position: { x: number; y: number; z: number };
  progress: number; // 0-100
  connections: string[]; // IDs of connected nodes
  size: number; // Platform size
  glow: number; // Emissive intensity
  color: string; // Base color
  category?: 'vehicle' | 'home' | 'travel' | 'wealth' | 'love' | 'health' | 'other';
  isMainGoal?: boolean; // Main manifestation goal
}

interface DreamTemplate {
  category: string;
  icon: string;
  title: string;
  color: string;
  examples: string[];
}

// ============================================================================
// DREAM TEMPLATES
// ============================================================================

const DREAM_TEMPLATES: DreamTemplate[] = [
  {
    category: 'vehicle',
    icon: '🚗',
    title: 'Vehicle',
    color: '#ef4444',
    examples: ['Tesla Model S', 'Dream Car', 'Motorcycle']
  },
  {
    category: 'home',
    icon: '🏡',
    title: 'Home',
    color: '#f59e0b',
    examples: ['Dream House', 'Beach House', 'Apartment']
  },
  {
    category: 'travel',
    icon: '✈️',
    title: 'Travel',
    color: '#3b82f6',
    examples: ['Visit Japan', 'World Tour', 'Paris Trip']
  },
  {
    category: 'wealth',
    icon: '💰',
    title: 'Wealth',
    color: '#10b981',
    examples: ['$100K Income', 'Financial Freedom', 'Business Success']
  },
  {
    category: 'love',
    icon: '❤️',
    title: 'Love',
    color: '#ec4899',
    examples: ['Soulmate', 'Happy Relationship', 'Family']
  },
  {
    category: 'health',
    icon: '💪',
    title: 'Health',
    color: '#8b5cf6',
    examples: ['Fit Body', 'Run Marathon', 'Healthy Lifestyle']
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert database ManifestationNode to UI UniverseNode
 */
const toUniverseNode = (node: ManifestationNode): UniverseNode => {
  // Generate icon based on category if not provided
  const categoryIcons: Record<string, string> = {
    vehicle: '🚗',
    home: '🏠',
    travel: '✈️',
    wealth: '💰',
    love: '❤️',
    health: '💪',
    other: '⭐'
  };

  return {
    id: node.id,
    type: node.type,
    title: node.title,
    description: node.description,
    imageUrl: node.image_url,
    icon: categoryIcons[node.category || 'other'] || '⭐',
    position: {
      x: node.position_x,
      y: node.position_y,
      z: node.position_z
    },
    progress: node.progress,
    connections: node.connections,
    size: node.size,
    glow: node.glow,
    color: node.color,
    category: node.category,
    isMainGoal: node.type === 'goal'
  };
};

/**
 * Convert UI UniverseNode to database CreateManifestationNodeInput
 */
const toManifestationNodeInput = (node: Partial<UniverseNode> & { title: string }) => ({
  type: node.type || 'dream' as const,
  title: node.title,
  description: node.description,
  category: node.category || 'other' as const,
  position_x: node.position?.x || 0,
  position_y: node.position?.y || 0,
  position_z: node.position?.z || 0,
  color: node.color || '#fbbf24',
  size: node.size || 0.8,
  glow: node.glow || 0.8,
  image_url: node.imageUrl,
  progress: node.progress || 0,
  connections: node.connections || []
});

// ============================================================================
// 3D COMPONENTS
// ============================================================================

/**
 * EnergyConnection - Line connecting two dreams
 */
const EnergyConnection = ({
  start,
  end,
  color,
  active
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
  active: boolean;
}) => {
  const lineRef = useRef<any>(null);

  useFrame((state) => {
    if (lineRef.current && active) {
      // Pulse the line opacity
      const opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      if (lineRef.current.material) {
        lineRef.current.material.opacity = opacity;
      }
    }
  });

  return (
    <Line
      ref={lineRef}
      points={[start, end]}
      color={color}
      lineWidth={2}
      transparent
      opacity={active ? 0.5 : 0.2}
    />
  );
};

/**
 * UniverseScene - The 3D space
 */
const UniverseScene = ({
  nodes,
  selectedNodeId,
  onNodeClick
}: {
  nodes: UniverseNode[];
  selectedNodeId: string | null;
  onNodeClick: (id: string) => void;
}) => {
  return (
    <>
      {/* Immersive starfield with 5000 stars, nebula fog, and atmospheric lighting */}
      <StarfieldBackground />

      {/* Environment for reflections */}
      <Environment preset="night" />

      {/* Render all dream nodes with new adaptive visualization */}
      {nodes.map((node) => (
        <DreamNode
          key={node.id}
          dream={{
            id: node.id,
            title: node.title,
            type: node.type,
            color: node.color,
            progress: node.progress,
            imageUrl: node.imageUrl,
            icon: node.icon,
            category: node.category,
            isMainGoal: node.isMainGoal || node.type === 'goal'
          }}
          position={[node.position.x, node.position.y, node.position.z]}
          isSelected={selectedNodeId === node.id}
          onSelect={onNodeClick}
        />
      ))}

      {/* Render connections */}
      {nodes.map((node) =>
        node.connections.map((connectedId) => {
          const connectedNode = nodes.find((n) => n.id === connectedId);
          if (!connectedNode) return null;

          const start = new THREE.Vector3(node.position.x, node.position.y, node.position.z);
          const end = new THREE.Vector3(
            connectedNode.position.x,
            connectedNode.position.y,
            connectedNode.position.z
          );

          return (
            <EnergyConnection
              key={`${node.id}-${connectedId}`}
              start={start}
              end={end}
              color={node.color}
              active={node.progress > 0}
            />
          );
        })
      )}

      {/* Cinematic camera controller with smooth transitions */}
      <CameraController
        selectedNodePosition={
          selectedNodeId
            ? (() => {
                const selected = nodes.find(n => n.id === selectedNodeId);
                return selected
                  ? [selected.position.x, selected.position.y, selected.position.z] as [number, number, number]
                  : undefined;
              })()
            : undefined
        }
        autoOrbit={false}
        enableUserControl={true}
      />
    </>
  );
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate circular orbit position for dream
 * Main goal always at center (0, 0, 0)
 * Other dreams orbit around it with proper spacing
 */
const calculateDreamPosition = (index: number, totalDreams: number, isMainGoal: boolean) => {
  if (isMainGoal) {
    return { x: 0, y: 0, z: 0 };
  }

  const radius = 10; // Distance from center
  const angleStep = (Math.PI * 2) / totalDreams;
  const angle = angleStep * index;

  return {
    x: Math.cos(angle) * radius,
    y: 0, // Keep all on same level
    z: Math.sin(angle) * radius
  };
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ManifestationUniverse = () => {
  const navigate = useNavigate();

  // Zustand store
  const {
    user,
    profile,
    manifestationNodes,
    selectedNodeId,
    isLoadingNodes,
    loadManifestationNodes,
    addManifestationNode,
    selectNode
  } = useManifestStore();

  // Local UI state
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [setupStage, setSetupStage] = useState<'welcome' | 'main-goal' | 'add-dreams' | 'complete'>('welcome');

  // Image picker state
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DreamTemplate | null>(null);

  // Convert database nodes to UI nodes
  const nodes: UniverseNode[] = manifestationNodes.map(toUniverseNode);

  // Load manifestation nodes from database on mount
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        console.log('⚠️ No user found, skipping database load');
        return;
      }

      try {
        console.log('🔍 Loading manifestation nodes from database...');
        await loadManifestationNodes();
        console.log('✅ Manifestation nodes loaded successfully:', manifestationNodes.length);
      } catch (error: any) {
        console.error('❌ Failed to load manifestation nodes:', error);

        // Check if it's a "table doesn't exist" error
        if (error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
          console.error('🚨 DATABASE TABLE NOT FOUND! Run the migration first.');
          toast.error('Database not set up. Please run migration first.', { duration: 10000 });
        } else {
          toast.error('Failed to load your universe. Using empty state.');
        }

        // DON'T block rendering - continue with empty state
      }
    };

    loadData();
  }, [user]); // Removed loadManifestationNodes from deps to prevent infinite loop

  // Initialize with main goal from onboarding if no nodes exist
  useEffect(() => {
    const initializeMainGoal = async () => {
      if (profile?.manifestation_goal && nodes.length === 0 && !isLoadingNodes && user) {
        try {
          console.log('🌟 Creating main goal node from onboarding:', profile.manifestation_goal);

          // Auto-fetch image for main goal
          let imageUrl = '';
          try {
            console.log('🖼️ Auto-fetching image for main goal...');
            const images = await searchUnsplashImages(profile.manifestation_goal, 1);
            if (images.length > 0) {
              imageUrl = images[0].url;
              console.log('✅ Auto-fetched image:', imageUrl);
            }
          } catch (imageError) {
            console.error('⚠️ Failed to fetch image, will use emoji fallback:', imageError);
            // Continue without image - emoji fallback will be used
          }

          await addManifestationNode(toManifestationNodeInput({
            type: 'goal',
            title: profile.manifestation_goal,
            position: { x: 0, y: 0, z: 0 },
            progress: 0,
            connections: [],
            size: 1.5,
            glow: 1.5,
            color: '#fbbf24',
            imageUrl: imageUrl || undefined // Add auto-fetched image
          }));
          console.log('✅ Main goal created successfully' + (imageUrl ? ' with image' : ''));
          toast.success('Your main goal has been added to your universe!');
        } catch (error: any) {
          console.error('❌ Failed to create main goal:', error);

          // Check if it's a DB error
          if (error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
            console.error('🚨 Cannot create goal - database table missing!');
            toast.error('Database not ready. Please run migration.', { duration: 10000 });
          } else {
            toast.error('Could not create your main goal');
          }

          // Continue rendering anyway - don't crash
        }
      }
    };

    // Add a slight delay to ensure DB load attempt completes first
    const timer = setTimeout(initializeMainGoal, 500);
    return () => clearTimeout(timer);
  }, [profile?.manifestation_goal, nodes.length, isLoadingNodes, user]);

  // Open image picker for a template
  const openImagePicker = (template: DreamTemplate) => {
    setSelectedTemplate(template);
    setImagePickerOpen(true);
  };

  // Add a new dream with image
  const addDream = async (template: DreamTemplate, imageUrl: string, customTitle?: string) => {
    try {
      console.log('➕ Adding dream:', customTitle || template.examples[0], 'with image:', imageUrl);

      // Find the main goal node to connect to
      const mainGoalNode = nodes.find(n => n.type === 'goal');
      // Calculate position in circular orbit around main goal
      const dreamNodes = nodes.filter(n => n.type !== 'goal');
      const nextIndex = dreamNodes.length;
      const totalDreams = dreamNodes.length + 1;
      const position = calculateDreamPosition(nextIndex, totalDreams, false);

      const newDreamData = toManifestationNodeInput({
        type: 'dream',
        title: customTitle || template.examples[0],
        position,
        progress: 0,
        connections: mainGoalNode ? [mainGoalNode.id] : [], // Auto-connect to main goal
        size: 1.0,
        glow: 0.8,
        color: template.color,
        category: template.category as any,
        imageUrl: imageUrl || undefined // Add image URL
      });

      await addManifestationNode(newDreamData);
      console.log('✅ Dream added successfully with image');
      toast.success(`${template.icon} Dream added to your universe!`);
    } catch (error: any) {
      console.error('❌ Failed to add dream:', error);

      if (error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
        toast.error('Database not set up. Please run migration first.', { duration: 10000 });
      } else {
        toast.error('Failed to add dream. Please try again.');
      }
    }
  };

  // Handle image selection from picker
  const handleImageSelected = (imageUrl: string) => {
    if (selectedTemplate) {
      addDream(selectedTemplate, imageUrl);
      setImagePickerOpen(false);
      setSelectedTemplate(null);
    }
  };

  // Handle emoji fallback (when user skips image selection)
  const handleEmojiSelected = (emoji: string) => {
    if (selectedTemplate) {
      addDream(selectedTemplate, ''); // Empty string means use emoji
      setImagePickerOpen(false);
      setSelectedTemplate(null);
    }
  };

  // Complete first-time setup
  const completeSetup = () => {
    setIsFirstTime(false);
    setSetupStage('complete');
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Loading State */}
      {isLoadingNodes && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white text-lg">Loading your universe...</p>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 5, 15], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <UniverseScene
          nodes={nodes}
          selectedNodeId={selectedNodeId}
          onNodeClick={selectNode}
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-6 pointer-events-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Your Universe</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* First-time setup flow */}
        {isFirstTime && (
          <AnimatePresence mode="wait">
            {setupStage === 'welcome' && (
              <motion.div
                key="welcome"
                className="absolute inset-0 flex items-center justify-center bg-black/80 pointer-events-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center max-w-2xl px-8">
                  <motion.h2
                    className="text-5xl font-bold text-white mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Welcome to Your Universe
                  </motion.h2>
                  <motion.p
                    className="text-xl text-white/60 mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Place your dreams in 3D space. Watch them glow brighter as you make progress.
                    Your manifestation journey starts here.
                  </motion.p>
                  <motion.button
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold text-lg hover:scale-105 transition-transform"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    onClick={() => setSetupStage('add-dreams')}
                  >
                    Begin Your Journey
                  </motion.button>
                </div>
              </motion.div>
            )}

            {setupStage === 'add-dreams' && (
              <motion.div
                key="add-dreams"
                className="absolute bottom-0 left-0 right-0 p-6 pointer-events-auto"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
              >
                <div className="bg-gradient-to-t from-black via-black/95 to-transparent p-8 rounded-t-3xl">
                  <h3 className="text-2xl font-bold text-white mb-4">Add Your Dreams</h3>
                  <p className="text-white/60 mb-6">
                    Quick-add your goals using our templates, or create custom ones
                  </p>

                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
                    {DREAM_TEMPLATES.map((template) => (
                      <button
                        key={template.category}
                        onClick={() => openImagePicker(template)}
                        className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                      >
                        <span className="text-4xl">{template.icon}</span>
                        <span className="text-sm text-white/80">{template.title}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => completeSetup()}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:scale-105 transition-transform"
                      disabled={nodes.length < 2}
                    >
                      Complete Setup ({nodes.length - 1} dreams added)
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Regular UI (after setup) */}
        {!isFirstTime && (
          <div className="absolute bottom-6 right-6 pointer-events-auto">
            <button
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold shadow-lg hover:scale-105 transition-transform"
              onClick={() => setSetupStage('add-dreams')}
            >
              + Add Dream
            </button>
          </div>
        )}
      </div>

      {/* Image Picker Modal */}
      {selectedTemplate && (
        <ImagePickerModal
          isOpen={imagePickerOpen}
          onClose={() => {
            setImagePickerOpen(false);
            setSelectedTemplate(null);
          }}
          onSelectImage={handleImageSelected}
          onSelectEmoji={handleEmojiSelected}
          defaultSearchTerm={getCategorySearchTerm(selectedTemplate.category)}
          category={selectedTemplate.category}
          categoryIcon={selectedTemplate.icon}
        />
      )}
    </div>
  );
};

export default ManifestationUniverse;
