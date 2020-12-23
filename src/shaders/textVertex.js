import perlinNoise from "./perlin.noise"

export const textVs = `
  #define PI 3.14159265359
  #define TAU 6.28318530717958647692528

  uniform float uTime;

  varying vec2 vUv;

  ${perlinNoise}

  void main () {
    vUv = uv;

    vec3 newPos = position;

    float noise = snoise(vec4(newPos * 0.5, uTime * 0.5));

    newPos = normalize(newPos) * (noise + 2.0);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos * 0.25, 1.0);
  }
`