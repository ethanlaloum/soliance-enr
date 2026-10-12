import { CanvasTexture, SRGBColorSpace } from 'three';

type Painter = (context: CanvasRenderingContext2D, width: number, height: number) => void;

const paintTexture = (width: number, height: number, painter: Painter): CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (context) painter(context, width, height);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
};

export type CompassLetters = { north: string; east: string; south: string; west: string };

export const createCompassTexture = ({ north, south }: CompassLetters) =>
  paintTexture(512, 512, (context, width) => {
    const center = width / 2;
    const radius = center - 80;
    context.clearRect(0, 0, width, width);
    context.strokeStyle = 'rgba(221, 248, 255, 0.55)';
    context.lineWidth = 3;
    context.beginPath();
    context.arc(center, center, radius, 0, Math.PI * 2);
    context.stroke();
    context.fillStyle = 'rgba(221, 248, 255, 0.85)';
    context.font = '600 54px "Bai Jamjuree", Helvetica, Arial, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(north, center, center - radius - 40);
    context.fillText(south, center, center + radius + 40);
    context.beginPath();
    context.moveTo(center, center - radius + 14);
    context.lineTo(center - 14, center - radius + 44);
    context.lineTo(center + 14, center - radius + 44);
    context.closePath();
    context.fill();
  });

export const createGlowTexture = () =>
  paintTexture(64, 64, (context, width, height) => {
    const gradient = context.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.35, 'rgba(255, 255, 255, 0.35)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    context.clearRect(0, 0, width, height);
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  });
