'use client';

import { useEffect, useRef } from 'react';

export default function DreamPortal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true
    });
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Create curves array first (before resize function)
    const curves: any[] = [];

    const resize = () => {
      rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);

      // Regenerate curves (only if already initialized)
      if (curves.length > 0) {
        curves.forEach(curve => curve.generatePoints());
      }
    };
    resize();

    // High quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Flowing curve class
    class FlowingCurve {
      points: { x: number; y: number }[] = [];
      color: { h: number; s: number; l: number };
      phase: number;
      speed: number;
      amplitude: number;
      frequency: number;
      thickness: number;
      offset: number;
      waveCount: number;

      constructor(index: number) {
        this.color = {
          h: 270 + Math.random() * 30,
          s: 70,
          l: 60
        };
        this.phase = Math.random() * Math.PI * 2;
        this.speed = 0.00008 + Math.random() * 0.00015; // Very slow
        this.amplitude = 35 + Math.random() * 70;
        this.frequency = 0.005 + Math.random() * 0.007;
        this.thickness = 1.2 + Math.random() * 2;
        this.offset = (index - 5) * 35; // Center around middle
        this.waveCount = 4 + Math.floor(Math.random() * 2); // 4-5 waves for fluidity

        this.generatePoints();
      }

      generatePoints() {
        this.points = [];
        const segments = 250; // Very smooth

        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const x = t * rect.width;
          const y = rect.height / 2 + this.offset;

          this.points.push({ x, y });
        }
      }

      update(time: number) {
        // Create VERY organic flowing curves
        for (let i = 0; i < this.points.length; i++) {
          const t = i / this.points.length;
          const x = t * rect.width;

          let y = rect.height / 2 + this.offset;

          // Layer multiple sine waves for VERY organic flow
          for (let w = 0; w < this.waveCount; w++) {
            const waveFreq = this.frequency * (w + 1) * 1.3;
            const waveAmp = this.amplitude / Math.pow(w + 1, 0.7);
            const waveSpeed = this.speed * (1 + w * 0.25);
            const wavePhase = this.phase + w * Math.PI / 4;

            y += Math.sin(
              t * Math.PI * 2 * waveFreq +
              time * waveSpeed +
              wavePhase
            ) * waveAmp;
          }

          // Perlin-like smooth variation
          y += Math.sin(t * Math.PI * 0.6 + time * this.speed * 0.4) * (this.amplitude * 0.35);

          // Second variation layer for MORE fluidity
          y += Math.cos(t * Math.PI * 1.3 + time * this.speed * 0.6) * (this.amplitude * 0.25);

          // Third variation for ultimate organic feel
          y += Math.sin(t * Math.PI * 2.7 + time * this.speed * 0.8) * (this.amplitude * 0.15);

          this.points[i] = { x, y };
        }
      }

      draw(ctx: CanvasRenderingContext2D, time: number) {
        if (this.points.length < 2) return;

        // Create path
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);

        // Catmull-Rom spline for ultra-smooth curves
        for (let i = 0; i < this.points.length - 2; i += 2) {
          const p0 = this.points[Math.max(0, i - 1)];
          const p1 = this.points[i];
          const p2 = this.points[Math.min(i + 1, this.points.length - 1)];
          const p3 = this.points[Math.min(i + 2, this.points.length - 1)];

          const cp1x = p1.x + (p2.x - p0.x) / 6;
          const cp1y = p1.y + (p2.y - p0.y) / 6;
          const cp2x = p2.x - (p3.x - p1.x) / 6;
          const cp2y = p2.y - (p3.y - p1.y) / 6;

          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }

        const glow = Math.sin(time * 0.0004 + this.phase) * 0.12 + 0.88;

        // Outer glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l}%, 0.25)`;
        ctx.strokeStyle = `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l}%, 0.05)`;
        ctx.lineWidth = this.thickness * 7;
        ctx.stroke();

        // Mid glow
        ctx.shadowBlur = 5;
        ctx.strokeStyle = `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l}%, 0.12)`;
        ctx.lineWidth = this.thickness * 3.5;
        ctx.stroke();

        // Inner glow
        ctx.shadowBlur = 2;
        ctx.strokeStyle = `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l}%, ${0.2 * glow})`;
        ctx.lineWidth = this.thickness * 1.8;
        ctx.stroke();

        // Core (sharp)
        ctx.shadowBlur = 0;
        ctx.strokeStyle = `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l + 12}%, ${0.32 * glow})`;
        ctx.lineWidth = this.thickness;
        ctx.stroke();
      }
    }

    // Initialize curves
    const curveCount = 12; // More curves for richness

    for (let i = 0; i < curveCount; i++) {
      curves.push(new FlowingCurve(i));
    }

    // Animation loop
    let time = 0;
    let animationId: number;

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Update and draw all curves
      curves.forEach(curve => {
        curve.update(time);
        curve.draw(ctx, time);
      });

      time += 6; // Slow, smooth
      animationId = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        opacity: 0.65,
        mixBlendMode: 'normal'
      }}
    />
  );
}
