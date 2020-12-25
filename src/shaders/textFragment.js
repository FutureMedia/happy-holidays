export const textFs = `
  uniform float uTime;
  uniform sampler2D uBufferTexture;

  varying vec2 vUv;

  void main(){
    vec4 text = texture2D(uBufferTexture, vUv);

    gl_FragColor = text;
  }
`