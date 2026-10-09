import { spawnSync } from 'node:child_process';
import { mkdirSync, renameSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = resolve(appRoot, 'public/videos');
const fps = 60;
const duration = 18;
const frames = fps * duration;
const phase = `2*PI*on/${frames}`;
const zoom = `(1+0.02*(1-cos(${phase})))`;
const left = `(W-W/${zoom})*(0.62+0.12*sin(${phase}))`;
const top = `(H-H/${zoom})*(0.5+0.1*sin(${phase}))`;

// Perspective evaluates fractional source coordinates for every frame.
// zoompan rounds its crop coordinates to pixels, which caused visible judder.
const camera = (size) => [
  `scale=${size.replace('x', ':')}:flags=lanczos`,
  'format=yuv444p',
  `perspective=x0='${left}':y0='${top}':x1='${left}+W/${zoom}':y1='${top}':x2='${left}':y2='${top}+H/${zoom}':x3='${left}+W/${zoom}':y3='${top}+H/${zoom}':sense=source:eval=frame:interpolation=cubic`,
  'format=yuv420p',
].join(',');

mkdirSync(outputDir, { recursive: true });
for (const variant of [
  { filename: 'hero-villa-premium.mp4', size: '1600x900', bitrate: '2000k', buffer: '4000k' },
  { filename: 'hero-villa-premium-mobile.mp4', size: '960x540', bitrate: '850k', buffer: '1700k' },
]) {
  const output = resolve(outputDir, variant.filename);
  const temporary = output.replace('.mp4', '.rendering.mp4');
  const result = spawnSync(process.argv[2] || 'ffmpeg', [
    '-hide_banner', '-loglevel', 'warning', '-y',
    '-loop', '1', '-framerate', String(fps),
    '-i', resolve(appRoot, 'public/images/hero-villa-premium.webp'),
    '-vf', camera(variant.size),
    '-frames:v', String(frames),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '23',
    '-maxrate', variant.bitrate, '-bufsize', variant.buffer,
    '-profile:v', 'high', '-level', '4.2',
    '-movflags', '+faststart', '-an', temporary,
  ], { stdio: 'inherit' });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
    break;
  }
  renameSync(temporary, output);
  console.log(`Created ${variant.filename} (${variant.size}, ${duration} s, ${fps} fps, fractional camera interpolation).`);
}
