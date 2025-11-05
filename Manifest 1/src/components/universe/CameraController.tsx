import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface CameraControllerProps {
  selectedNodePosition?: [number, number, number];
  autoOrbit?: boolean;
  enableUserControl?: boolean;
}

/**
 * CameraController - Cinematic camera system with smooth transitions
 *
 * Features:
 * - Smooth transitions to selected nodes
 * - Auto-orbit mode for mesmerizing effect
 * - User orbit controls with damping
 * - Dynamic camera distance based on scene content
 * - Smooth interpolation for all movements
 */
export default function CameraController({
  selectedNodePosition,
  autoOrbit = false,
  enableUserControl = true
}: CameraControllerProps) {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  const targetPosition = useRef(new THREE.Vector3(0, 0, 0));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const autoOrbitAngle = useRef(0);

  // Smooth transition to selected node
  useEffect(() => {
    if (selectedNodePosition && controlsRef.current) {
      const [x, y, z] = selectedNodePosition;

      // Set target for smooth interpolation
      targetLookAt.current.set(x, y, z);

      // Calculate optimal camera position (slightly offset for better view)
      const offset = new THREE.Vector3(3, 2, 3);
      targetPosition.current.set(x + offset.x, y + offset.y, z + offset.z);
    } else {
      // Return to default view
      targetPosition.current.set(0, 5, 15);
      targetLookAt.current.set(0, 0, 0);
    }
  }, [selectedNodePosition]);

  // Animation loop
  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    // Auto-orbit mode (when no node selected and autoOrbit enabled)
    if (autoOrbit && !selectedNodePosition) {
      autoOrbitAngle.current += delta * 0.1;

      const radius = 15;
      const height = 5;

      camera.position.x = Math.cos(autoOrbitAngle.current) * radius;
      camera.position.y = height + Math.sin(autoOrbitAngle.current * 0.5) * 2;
      camera.position.z = Math.sin(autoOrbitAngle.current) * radius;

      controlsRef.current.target.set(0, 0, 0);
    } else {
      // Smooth interpolation to target
      camera.position.lerp(targetPosition.current, delta * 2);
      controlsRef.current.target.lerp(targetLookAt.current, delta * 2);
    }

    // Update controls
    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={enableUserControl && !autoOrbit}
      enableDamping={true}
      dampingFactor={0.05}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
      panSpeed={0.5}
      minDistance={3}
      maxDistance={50}
      minPolarAngle={Math.PI / 6} // 30 degrees from top
      maxPolarAngle={Math.PI / 1.5} // 60 degrees from bottom
      enablePan={true}
      target={[0, 0, 0]}
    />
  );
}
