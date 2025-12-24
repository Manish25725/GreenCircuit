import React, { useEffect, useRef } from 'react';

interface Arc {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
}

interface GlobeConfig {
  pointSize: number;
  globeColor: string;
  showAtmosphere: boolean;
  atmosphereColor: string;
  atmosphereAltitude: number;
  emissive: string;
  emissiveIntensity: number;
  shininess: number;
  polygonColor: string;
  ambientLight: string;
  directionalLeftLight: string;
  directionalTopLight: string;
  pointLight: string;
  arcTime: number;
  arcLength: number;
  rings: number;
  maxRings: number;
  initialPosition: { lat: number; lng: number };
  autoRotate: boolean;
  autoRotateSpeed: number;
}

interface GlobeProps {
  data: Arc[];
  globeConfig: GlobeConfig;
}

export const Globe: React.FC<GlobeProps> = ({ data, globeConfig }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const rotationRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.35;

    // Draw rotating globe effect
    const drawGlobe = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw atmosphere glow
      if (globeConfig.showAtmosphere) {
        const gradient = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, radius * 1.2);
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0)');
        gradient.addColorStop(0.8, 'rgba(56, 189, 248, 0.1)');
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0.3)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw main globe
      const globeGradient = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        radius * 0.1,
        centerX,
        centerY,
        radius
      );
      globeGradient.addColorStop(0, '#0a4d7a');
      globeGradient.addColorStop(0.5, globeConfig.globeColor);
      globeGradient.addColorStop(1, '#021c33');

      ctx.fillStyle = globeGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;

      // Latitude lines
      for (let i = -90; i <= 90; i += 15) {
        ctx.beginPath();
        const y = centerY + (i / 90) * radius * 0.95;
        const width = Math.cos((i * Math.PI) / 180) * radius;
        ctx.ellipse(centerX, y, width, radius * 0.05, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Longitude lines (with rotation)
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        const angle = ((i * 30 + rotationRef.current) * Math.PI) / 180;
        ctx.ellipse(centerX, centerY, radius * Math.abs(Math.sin(angle)), radius, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw connection arcs
      data.slice(0, 20).forEach((arc, index) => {
        const progress = (Date.now() / globeConfig.arcTime + index * 0.1) % 1;
        
        // Convert lat/lng to canvas coordinates (simplified)
        const startX = centerX + Math.cos((arc.startLng + rotationRef.current) * Math.PI / 180) * radius * 0.8;
        const startY = centerY + Math.sin(arc.startLat * Math.PI / 180) * radius * 0.8;
        const endX = centerX + Math.cos((arc.endLng + rotationRef.current) * Math.PI / 180) * radius * 0.8;
        const endY = centerY + Math.sin(arc.endLat * Math.PI / 180) * radius * 0.8;

        // Draw arc
        ctx.beginPath();
        ctx.strokeStyle = arc.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3 + progress * 0.4;

        const controlX = (startX + endX) / 2;
        const controlY = Math.min(startY, endY) - radius * arc.arcAlt;

        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(controlX, controlY, endX, endY);
        ctx.stroke();

        // Draw moving point on arc
        const t = progress;
        const pointX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
        const pointY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;

        ctx.globalAlpha = 1;
        ctx.fillStyle = arc.color;
        ctx.beginPath();
        ctx.arc(pointX, pointY, globeConfig.pointSize, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      // Auto-rotate
      if (globeConfig.autoRotate) {
        rotationRef.current += globeConfig.autoRotateSpeed;
      }

      animationFrameRef.current = requestAnimationFrame(drawGlobe);
    };

    drawGlobe();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [data, globeConfig]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
};

export default Globe;
