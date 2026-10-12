import { Color, DoubleSide, Matrix4, ShaderMaterial, Vector2, Vector4 } from 'three';
import { palette } from '@/components/simulator/house/housePalette';

export type SceneUniforms = {
  stageInverse: Matrix4;
  pixelRatio: { value: number };
};

const hash3 = `
float hash3(vec3 point) {
  return fract(sin(dot(point, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}
`;

const stageVertexShader = `
uniform mat4 uStageInverse;
varying vec3 vLocal;
varying vec3 vNormalLocal;
varying vec3 vViewDirection;
varying vec3 vObject;
varying vec3 vObjectNormal;
varying vec3 vFromOrigin;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vLocal = (uStageInverse * world).xyz;
  vNormalLocal = normalize(mat3(uStageInverse) * mat3(modelMatrix) * normal);
  vViewDirection = normalize(mat3(uStageInverse) * (cameraPosition - world.xyz));
  vObject = position;
  vObjectNormal = normal;
  vFromOrigin = mat3(uStageInverse) * (world.xyz - modelMatrix[3].xyz);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const boxEdgeDistance = `
float boxEdgeDistance() {
  vec3 toEdge = (0.5 - abs(vObject)) / max(fwidth(vObject), vec3(1e-5));
  vec3 axis = abs(vObjectNormal);
  float distanceToEdge = axis.x > 0.5 ? min(toEdge.y, toEdge.z) : (axis.y > 0.5 ? min(toEdge.x, toEdge.z) : min(toEdge.x, toEdge.y));
  return max(distanceToEdge, 0.0);
}
`;

const glassFragmentShader = `
uniform vec3 uFillColor;
uniform vec3 uLineColor;
uniform vec3 uFlashColor;
uniform float uFill;
uniform float uLine;
uniform float uCell;
uniform float uGlow;
uniform float uFresnel;
uniform float uBoxEdges;
uniform float uRezz;
uniform float uPixelRatio;
uniform float uOpacity;
varying vec3 vLocal;
varying vec3 vNormalLocal;
varying vec3 vViewDirection;
varying vec3 vObject;
varying vec3 vObjectNormal;
varying vec3 vFromOrigin;
${hash3}
${boxEdgeDistance}
void main() {
  vec3 normal = normalize(vNormalLocal);
  vec3 axis = abs(normal);
  vec2 coordinate = axis.x > axis.y && axis.x > axis.z ? vLocal.zy : (axis.y > axis.z ? vLocal.xz : vLocal.xy);
  vec2 cell = coordinate / uCell;
  vec2 cellWidth = max(fwidth(cell), vec2(1e-4));
  vec2 toLine = abs(fract(cell - 0.5) - 0.5) / cellWidth;
  float detail = 1.0 - smoothstep(0.12, 0.22, max(cellWidth.x, cellWidth.y));
  float line = (1.0 - min(min(toLine.x, toLine.y), 1.0)) * detail;
  float halo = uGlow * uBoxEdges * exp(-boxEdgeDistance() / (2.5 * uPixelRatio));
  float fresnel = pow(1.0 - abs(dot(normal, normalize(vViewDirection))), 3.0);

  vec3 voxel = floor(vLocal / uCell);
  float revealAt = 0.3 + clamp((voxel.y + 0.5) * uCell / 5.6, 0.0, 1.0) * 0.8 + hash3(voxel) * 0.3;
  float since = uRezz - revealAt;
  float shown = step(0.0, since);
  float flash = shown * exp(-max(since, 0.0) / 0.18);

  float fillAlpha = uFill * shown;
  float lightAlpha = clamp((line * uLine + fresnel * uFresnel) * shown + halo, 0.0, 1.0);
  float flashAlpha = flash * 0.35;
  float alpha = clamp(fillAlpha + lightAlpha + flashAlpha, 0.0, 1.0);
  vec3 color = (uFillColor * fillAlpha + uLineColor * lightAlpha + uFlashColor * flashAlpha) / max(fillAlpha + lightAlpha + flashAlpha, 1e-4);
  gl_FragColor = vec4(color, alpha * uOpacity);
  #include <colorspace_fragment>
}
`;

type GlassOptions = {
  fillColor: string;
  fill: number;
  lineColor?: string;
  line?: number;
  cell?: number;
  glow?: number;
  fresnel?: number;
  boxEdges?: boolean;
  rezz?: { value: number };
};

export const createGlassMaterial = (
  scene: SceneUniforms,
  { fillColor, fill, lineColor = palette.glow, line = 0, cell = 0.5, glow = 0, fresnel = 0, boxEdges = true, rezz = { value: 1000 } }: GlassOptions,
) =>
  new ShaderMaterial({
    uniforms: {
      uStageInverse: { value: scene.stageInverse },
      uPixelRatio: scene.pixelRatio,
      uFillColor: { value: new Color(fillColor) },
      uLineColor: { value: new Color(lineColor) },
      uFlashColor: { value: new Color(palette.glow) },
      uFill: { value: fill },
      uLine: { value: line },
      uCell: { value: cell },
      uGlow: { value: glow },
      uFresnel: { value: fresnel },
      uBoxEdges: { value: boxEdges ? 1 : 0 },
      uRezz: rezz,
      uOpacity: { value: 1 },
    },
    vertexShader: stageVertexShader,
    fragmentShader: glassFragmentShader,
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
  });

const deviceFragmentShader = `
uniform vec3 uBody;
uniform vec3 uEdge;
uniform vec3 uFlashColor;
uniform float uBoxEdges;
uniform float uPixelRatio;
uniform float uProgress;
uniform float uCell;
varying vec3 vLocal;
varying vec3 vNormalLocal;
varying vec3 vViewDirection;
varying vec3 vObject;
varying vec3 vObjectNormal;
varying vec3 vFromOrigin;
${hash3}
${boxEdgeDistance}
void main() {
  vec3 normal = normalize(vNormalLocal);
  float halo = uBoxEdges * exp(-boxEdgeDistance() / (3.0 * uPixelRatio));
  float rim = pow(1.0 - abs(dot(normal, normalize(vViewDirection))), 2.0);
  float lift = 0.18 + 0.12 * max(normal.y, 0.0);
  vec3 color = mix(uBody, uEdge, clamp(lift + halo * 0.85 + rim * 0.45, 0.0, 1.0));
  float threshold = 0.02 + 0.98 * hash3(floor(vFromOrigin / uCell));
  float reveal = uProgress * 1.25 - threshold;
  if (reveal <= 0.0) discard;
  float flash = exp(-reveal / 0.08);
  gl_FragColor = vec4(mix(color, uFlashColor, clamp(flash, 0.0, 1.0) * 0.85), 1.0);
  #include <colorspace_fragment>
}
`;

type DeviceOptions = {
  boxEdges?: boolean;
  cell?: number;
  body?: string;
};

export const createDeviceMaterial = (scene: SceneUniforms, { boxEdges = true, cell = 0.12, body = palette.deviceBody }: DeviceOptions = {}) =>
  new ShaderMaterial({
    uniforms: {
      uStageInverse: { value: scene.stageInverse },
      uPixelRatio: scene.pixelRatio,
      uBody: { value: new Color(body) },
      uEdge: { value: new Color(palette.deviceEdge) },
      uFlashColor: { value: new Color(palette.flash) },
      uBoxEdges: { value: boxEdges ? 1 : 0 },
      uProgress: { value: 0 },
      uCell: { value: cell },
    },
    vertexShader: stageVertexShader,
    fragmentShader: deviceFragmentShader,
  });

const floorVertexShader = `
uniform mat4 uStageInverse;
varying vec2 vGround;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vGround = (uStageInverse * world).xz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const floorFragmentShader = `
uniform vec3 uColor;
uniform vec2 uHouseHalf;
uniform vec4 uPool;
uniform float uPoolOpen;
uniform float uPixelRatio;
varying vec2 vGround;
float hash2(vec2 point) {
  return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
}
void main() {
  vec2 minorWidth = max(fwidth(vGround), vec2(1e-4));
  vec2 minorDistance = abs(fract(vGround - 0.5) - 0.5) / minorWidth;
  float minorLine = 1.0 - min(min(minorDistance.x, minorDistance.y), 1.0);
  float minorDetail = 1.0 - smoothstep(0.12, 0.25, max(minorWidth.x, minorWidth.y));
  vec2 major = vGround / 5.0;
  vec2 majorWidth = max(fwidth(major), vec2(1e-4));
  vec2 majorDistance = abs(fract(major - 0.5) - 0.5) / majorWidth;
  float majorPixels = min(majorDistance.x, majorDistance.y);
  float majorLine = 1.0 - min(majorPixels, 1.0);
  float fade = 1.0 - smoothstep(10.0, 30.0, length((vGround - vec2(0.0, 2.0)) / vec2(1.25, 1.0)));
  float spill = exp(-length(max(abs(vGround) - uHouseHalf, 0.0)) / 2.5);
  float litTile = step(0.76, hash2(floor(vGround))) * spill;
  vec2 poolOffset = abs(vGround - uPool.xy) - uPool.zw;
  float alpha = (minorLine * 0.1 * minorDetail + majorLine * 0.3 + exp(-majorPixels / (2.0 * uPixelRatio)) * 0.1 + spill * 0.06 + litTile * 0.12) * fade;
  if (uPoolOpen > 0.5 && poolOffset.x < 0.0 && poolOffset.y < 0.0) discard;
  gl_FragColor = vec4(uColor, alpha);
  #include <colorspace_fragment>
}
`;

export const createFloorMaterial = (scene: SceneUniforms) =>
  new ShaderMaterial({
    uniforms: {
      uStageInverse: { value: scene.stageInverse },
      uPixelRatio: scene.pixelRatio,
      uColor: { value: new Color(palette.glow) },
      uHouseHalf: { value: new Vector2(5, 4.25) },
      uPool: { value: new Vector4(0, 8.8, 2.5, 1.3) },
      uPoolOpen: { value: 0 },
    },
    vertexShader: floorVertexShader,
    fragmentShader: floorFragmentShader,
    transparent: true,
    depthWrite: true,
  });

const uvVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const panelFragmentShader = `
uniform vec3 uTile;
uniform vec3 uCore;
uniform vec3 uGlow;
uniform float uEnergy;
uniform float uPixelRatio;
varying vec2 vUv;
void main() {
  vec2 uvWidth = max(fwidth(vUv), vec2(1e-5));
  vec2 border = min(vUv, 1.0 - vUv) / uvWidth;
  float borderPixels = min(border.x, border.y);
  float core = 1.0 - smoothstep(0.6 * uPixelRatio, 1.4 * uPixelRatio, borderPixels);
  float halo = exp(-borderPixels / (2.5 * uPixelRatio));
  vec2 cells = vUv * vec2(6.0, 10.0);
  vec2 cellWidth = max(fwidth(cells), vec2(1e-4));
  vec2 toCell = abs(fract(cells - 0.5) - 0.5) / cellWidth;
  float cellLine = (1.0 - min(min(toCell.x, toCell.y), 1.0)) * (1.0 - smoothstep(0.18, 0.3, max(cellWidth.x, cellWidth.y)));
  vec3 color = uTile + uEnergy * (uCore * core + uGlow * (0.45 * halo + 0.22 * cellLine + 0.07));
  gl_FragColor = vec4(min(color, vec3(1.0)), 1.0);
  #include <colorspace_fragment>
}
`;

export const createPanelTopMaterial = (scene: SceneUniforms, energy: { value: number }) =>
  new ShaderMaterial({
    uniforms: {
      uPixelRatio: scene.pixelRatio,
      uTile: { value: new Color(palette.panelTile) },
      uCore: { value: new Color(palette.energyCore) },
      uGlow: { value: new Color(palette.energyGlow) },
      uEnergy: energy,
    },
    vertexShader: uvVertexShader,
    fragmentShader: panelFragmentShader,
  });

const waterFragmentShader = `
uniform vec3 uColor;
uniform float uLevel;
uniform float uPixelRatio;
varying vec2 vUv;
void main() {
  vec2 uvWidth = max(fwidth(vUv), vec2(1e-5));
  vec2 border = min(vUv, 1.0 - vUv) / uvWidth;
  float edgePixels = min(border.x, border.y);
  float alpha = (0.16 + 0.3 * exp(-edgePixels / (6.0 * uPixelRatio))) * uLevel;
  gl_FragColor = vec4(uColor, alpha);
  #include <colorspace_fragment>
}
`;

export const createWaterSurfaceMaterial = (scene: SceneUniforms) =>
  new ShaderMaterial({
    uniforms: {
      uPixelRatio: scene.pixelRatio,
      uColor: { value: new Color(palette.waterGlow) },
      uLevel: { value: 0 },
    },
    vertexShader: uvVertexShader,
    fragmentShader: waterFragmentShader,
    transparent: true,
    depthWrite: false,
  });
