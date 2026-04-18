import { useEffect, useRef } from 'react';
import type { SoundPalette } from '../data/sounds';

type ExperienceVisualCanvasProps = {
  palette: SoundPalette;
  sceneVersion: number;
};

type BlobConfig = {
  c: string;
  phase: number;
  rr: number;
  rx: number;
  ry: number;
  sx: number;
  sy: number;
};

function fadeRgba(rgba: string, alpha: number) {
  return rgba.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/, `rgba($1, $2, $3, ${alpha})`);
}

function hexToRgba(hex: string, alpha: number) {
  let color = hex.replace('#', '');

  if (color.length === 3) {
    color = color
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const bigint = Number.parseInt(color, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawSoftBlob(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.32, fadeRgba(color, 0.55));
  gradient.addColorStop(0.68, fadeRgba(color, 0.18));
  gradient.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.beginPath();
  ctx.fillStyle = gradient;
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawCollisionRibbons(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  palette: readonly string[]
) {
  for (let index = 0; index < 4; index += 1) {
    ctx.beginPath();
    const baseY = height * (0.18 + index * 0.18);
    ctx.moveTo(-50, baseY);

    for (let x = -50; x <= width + 50; x += 18) {
      const y =
        baseY +
        Math.sin(x * 0.008 + time * 7 + index * 1.6) * 42 +
        Math.cos(x * 0.004 + time * 5 + index * 0.8) * 28;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(width + 50, height + 50);
    ctx.lineTo(-50, height + 50);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, baseY - 80, width, baseY + 120);
    gradient.addColorStop(0, hexToRgba(palette[0], 0.04));
    gradient.addColorStop(0.35, hexToRgba(palette[1], 0.1));
    gradient.addColorStop(0.7, hexToRgba(palette[2], 0.08));
    gradient.addColorStop(1, 'rgba(255,255,255,0.02)');

    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

function drawLiquidVeils(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  palette: readonly string[]
) {
  for (let index = 0; index < 3; index += 1) {
    const gradient = ctx.createRadialGradient(
      width * (0.3 + index * 0.22 + Math.sin(time * (1 + index * 0.2)) * 0.05),
      height * (0.45 + Math.cos(time * (1.2 + index * 0.2)) * 0.06),
      0,
      width * (0.3 + index * 0.22),
      height * 0.45,
      Math.max(width, height) * 0.5
    );

    gradient.addColorStop(0, hexToRgba(palette[(index + 1) % palette.length], 0.1));
    gradient.addColorStop(0.45, hexToRgba(palette[(index + 2) % palette.length], 0.06));
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
}
export default function ExperienceVisualCanvas({ palette, sceneVersion }: ExperienceVisualCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && /jsdom/i.test(window.navigator.userAgent)) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const blobs: BlobConfig[] = [
      { rx: 0.18, ry: 0.22, rr: 0.36, c: palette[0], sx: 1.4, sy: 1.1, phase: 0.2 },
      { rx: 0.74, ry: 0.24, rr: 0.34, c: palette[1], sx: 1.2, sy: 1.5, phase: 1.3 },
      { rx: 0.48, ry: 0.58, rr: 0.42, c: palette[2], sx: 1, sy: 1.3, phase: 2.1 },
      { rx: 0.2, ry: 0.78, rr: 0.28, c: palette[1], sx: 1.6, sy: 1, phase: 0.8 },
      { rx: 0.82, ry: 0.72, rr: 0.3, c: palette[0], sx: 1.1, sy: 1.6, phase: 2.8 },
      { rx: 0.58, ry: 0.18, rr: 0.24, c: palette[3], sx: 1.8, sy: 1.2, phase: 1.7 }
    ];
    let frameId = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const render = (timestamp: number) => {
      const width = canvas.width;
      const height = canvas.height;
      const time = timestamp * 0.00022;

      ctx.clearRect(0, 0, width, height);

      const background = ctx.createLinearGradient(0, 0, width, height);
      background.addColorStop(0, palette[4]);
      background.addColorStop(0.28, palette[0]);
      background.addColorStop(0.62, palette[1]);
      background.addColorStop(1, palette[3]);
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'screen';

      blobs.forEach((blob, index) => {
        const x = width * (blob.rx + Math.sin(time * blob.sx + blob.phase) * 0.08);
        const y = height * (blob.ry + Math.cos(time * blob.sy + blob.phase) * 0.08);
        const radius = Math.min(width, height) * (blob.rr + Math.sin(time * 0.9 + index) * 0.03);

        drawSoftBlob(ctx, x, y, radius, hexToRgba(blob.c, 0.42));
      });

      ctx.globalCompositeOperation = 'lighter';
      drawCollisionRibbons(ctx, width, height, time, palette);

      ctx.globalCompositeOperation = 'overlay';
      drawLiquidVeils(ctx, width, height, time, palette);

      ctx.globalCompositeOperation = 'soft-light';
      const glow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      glow.addColorStop(0, 'rgba(255,255,255,0.14)');
      glow.addColorStop(0.5, hexToRgba(palette[2], 0.1));
      glow.addColorStop(1, hexToRgba(palette[0], 0.18));
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'source-over';
      frameId = window.requestAnimationFrame(render);
    };

    resizeCanvas();
    frameId = window.requestAnimationFrame(render);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [palette, sceneVersion]);

  return <canvas ref={canvasRef} className="experience-visual-canvas" aria-hidden="true" />;
}
