/**
 * PerformanceMonitor - Real-time FPS and Performance Tracking
 *
 * Features:
 * - Real-time FPS monitoring
 * - Performance metrics tracking
 * - Automatic quality adjustment
 * - Visual debug overlay (dev mode only)
 */

import { useEffect, useRef, useState } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  averageFps: number;
  droppedFrames: number;
  quality: 'high' | 'medium' | 'low';
}

interface PerformanceMonitorProps {
  /** Show debug overlay */
  showDebug?: boolean;

  /** Target FPS (default: 60) */
  targetFps?: number;

  /** Callback when FPS drops below target */
  onLowPerformance?: (metrics: PerformanceMetrics) => void;

  /** Enable automatic quality adjustment */
  autoAdjustQuality?: boolean;
}

// ============================================================================
// PERFORMANCE MONITOR HOOK
// ============================================================================

export const usePerformanceMonitor = (targetFps: number = 60) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    averageFps: 60,
    droppedFrames: 0,
    quality: 'high',
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);
  const droppedFramesRef = useRef(0);
  const rafIdRef = useRef<number>(0);

  useEffect(() => {
    const measurePerformance = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;

      frameCountRef.current++;

      // Calculate FPS every 10 frames
      if (frameCountRef.current % 10 === 0) {
        const currentFps = 1000 / delta;
        fpsHistoryRef.current.push(currentFps);

        // Keep only last 60 measurements
        if (fpsHistoryRef.current.length > 60) {
          fpsHistoryRef.current.shift();
        }

        // Calculate average FPS
        const averageFps =
          fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length;

        // Check for dropped frames
        if (currentFps < targetFps - 5) {
          droppedFramesRef.current++;
        }

        // Determine quality based on performance
        let quality: 'high' | 'medium' | 'low' = 'high';
        if (averageFps < 30) {
          quality = 'low';
        } else if (averageFps < 50) {
          quality = 'medium';
        }

        setMetrics({
          fps: Math.round(currentFps),
          frameTime: delta,
          averageFps: Math.round(averageFps),
          droppedFrames: droppedFramesRef.current,
          quality,
        });
      }

      lastTimeRef.current = now;
      rafIdRef.current = requestAnimationFrame(measurePerformance);
    };

    rafIdRef.current = requestAnimationFrame(measurePerformance);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [targetFps]);

  return metrics;
};

// ============================================================================
// PERFORMANCE MONITOR COMPONENT
// ============================================================================

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  showDebug = false,
  targetFps = 60,
  onLowPerformance,
  autoAdjustQuality = true,
}) => {
  const metrics = usePerformanceMonitor(targetFps);

  // Callback for low performance
  useEffect(() => {
    if (metrics.fps < targetFps - 10 && onLowPerformance) {
      onLowPerformance(metrics);
    }
  }, [metrics, targetFps, onLowPerformance]);

  // Auto-adjust quality settings
  useEffect(() => {
    if (!autoAdjustQuality) return;

    if (metrics.quality === 'low') {
      console.warn('⚠️ Low performance detected. Consider reducing animation complexity.');
      // Could dispatch events here to reduce particle counts, disable effects, etc.
    }
  }, [metrics.quality, autoAdjustQuality]);

  // Only show debug overlay in development
  if (!showDebug || process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg font-mono text-xs space-y-2 pointer-events-none">
      <div className="font-bold text-sm mb-2 text-purple-400">Performance Monitor</div>

      {/* FPS */}
      <div className="flex justify-between gap-4">
        <span className="opacity-60">FPS:</span>
        <span
          className={`font-bold ${
            metrics.fps >= targetFps
              ? 'text-green-400'
              : metrics.fps >= targetFps - 10
              ? 'text-yellow-400'
              : 'text-red-400'
          }`}
        >
          {metrics.fps}
        </span>
      </div>

      {/* Average FPS */}
      <div className="flex justify-between gap-4">
        <span className="opacity-60">Avg FPS:</span>
        <span className="text-white">{metrics.averageFps}</span>
      </div>

      {/* Frame Time */}
      <div className="flex justify-between gap-4">
        <span className="opacity-60">Frame Time:</span>
        <span className="text-white">{metrics.frameTime.toFixed(2)}ms</span>
      </div>

      {/* Dropped Frames */}
      <div className="flex justify-between gap-4">
        <span className="opacity-60">Dropped:</span>
        <span className={metrics.droppedFrames > 0 ? 'text-red-400' : 'text-green-400'}>
          {metrics.droppedFrames}
        </span>
      </div>

      {/* Quality */}
      <div className="flex justify-between gap-4">
        <span className="opacity-60">Quality:</span>
        <span
          className={`font-bold ${
            metrics.quality === 'high'
              ? 'text-green-400'
              : metrics.quality === 'medium'
              ? 'text-yellow-400'
              : 'text-red-400'
          }`}
        >
          {metrics.quality.toUpperCase()}
        </span>
      </div>

      {/* FPS Bar */}
      <div className="mt-4 pt-2 border-t border-white/20">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              metrics.fps >= targetFps
                ? 'bg-green-400'
                : metrics.fps >= targetFps - 10
                ? 'bg-yellow-400'
                : 'bg-red-400'
            }`}
            style={{ width: `${Math.min((metrics.fps / targetFps) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Warnings */}
      {metrics.quality === 'low' && (
        <div className="mt-2 pt-2 border-t border-red-500/30 text-red-400 text-xs">
          ⚠️ Low performance detected
        </div>
      )}
    </div>
  );
};

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Mark the start of a performance measurement
 */
export const markStart = (name: string) => {
  performance.mark(`${name}-start`);
};

/**
 * Mark the end of a performance measurement and log the result
 */
export const markEnd = (name: string, logToConsole: boolean = true) => {
  performance.mark(`${name}-end`);
  performance.measure(name, `${name}-start`, `${name}-end`);

  if (logToConsole) {
    const measure = performance.getEntriesByName(name)[0];
    if (measure) {
      console.log(`⏱️ ${name}: ${measure.duration.toFixed(2)}ms`);
    }
  }

  // Clean up marks
  performance.clearMarks(`${name}-start`);
  performance.clearMarks(`${name}-end`);
  performance.clearMeasures(name);
};

/**
 * Measure the performance of an async function
 */
export const measureAsync = async <T,>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  markStart(name);
  try {
    const result = await fn();
    markEnd(name);
    return result;
  } catch (error) {
    markEnd(name);
    throw error;
  }
};

/**
 * Measure the performance of a synchronous function
 */
export const measureSync = <T,>(name: string, fn: () => T): T => {
  markStart(name);
  try {
    const result = fn();
    markEnd(name);
    return result;
  } catch (error) {
    markEnd(name);
    throw error;
  }
};

/**
 * Check if device is capable of high-performance animations
 */
export const checkDeviceCapability = (): 'high' | 'medium' | 'low' => {
  // Check for WebGL support
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!gl) {
    return 'low';
  }

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2;

  // Check for GPU info (if available)
  const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
  let isHighEndGPU = false;

  if (debugInfo) {
    const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    isHighEndGPU = /nvidia|amd|intel iris|apple/i.test(renderer);
  }

  // Determine capability
  if (cores >= 8 && isHighEndGPU) {
    return 'high';
  } else if (cores >= 4) {
    return 'medium';
  } else {
    return 'low';
  }
};

export default PerformanceMonitor;
