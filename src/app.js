import * as THREE from "three";
import { BasicThree } from "./basic-three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { CopyPass } from "three/examples/jsm/shaders/CopyShader";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";

// loader 3d model
import loaderModel from "./loadersModel";

// Shaders
import { textFs } from "./shaders/textFragment";
import { textVs } from "./shaders/textVertex";

export class App extends BasicThree {
  constructor(container) {
    super(container);
  }

  init() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.noZoom = true;
    controls.update();

    //this.scene.background = new THREE.Color(0xff0000);

    this.initEvents();
    this.addMesh();
    this.addLights();
    this.addPostProcessing();
  }

  loadModel(model) {}

  initEvents() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  addLights() {
    this.aL = new THREE.AmbientLight(0xff0000, 0.1);
    this.scene.add(this.aL);

    this.dL = new THREE.DirectionalLight(0xffffff, 0.25);
    this.dL.position.y = 100;
    this.scene.add(this.dL);

    this.dL2 = new THREE.DirectionalLight(0xffffff, 0.22);
    this.dL2.position.z = 100;
    this.dL2.position.y = -100;
    this.scene.add(this.dL2);
  }

  async addMesh() {
    const model = await loaderModel("../src/models/scene.gltf");

    const cubeTexture = new THREE.CubeTextureLoader()
      .setPath("../src/imgs/")
      .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);

    cubeTexture.encoding = THREE.sRGBEncoding;

    model.scene.traverse((child) => {
      if (child.isMesh) {
        child.scale.set(0.2, 0.3, 0.2);
        var center = new THREE.Vector3();
        child.geometry.computeBoundingBox();
        child.geometry.boundingBox.getCenter(center);
        child.geometry.center();
        child.position.copy(center);

        // child.geometry.center();
        child.material = new THREE.MeshStandardMaterial({
          envMap: cubeTexture,
          color: 0xffd700,
          metalness: 1,
          roughness: 0,
        });

        this.heart = child;
      }
    });

    this.scene.add(model.scene);

    this.tick();
  }

  addPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.renderToScreen = true;

    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    this.bloom = new UnrealBloomPass(
      new THREE.Vector2(this.width, this.height),
      1.5,
      0.4,
      0.85
    );
    this.bloom.threshold = 0.1;
    this.bloom.strength = 2;
    this.bloom.radius = 0.75;
    this.composer.addPass(this.bloom);

    this.fxaa = new ShaderPass(FXAAShader);
    const pixelRatio = this.renderer.getPixelRatio();
    this.fxaa.material.uniforms.resolution.value.x =
      (1 / this.width) * pixelRatio;
    this.fxaa.material.uniforms.resolution.value.y =
      (1 / this.height) * pixelRatio;
    this.composer.addPass(this.fxaa);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.renderer.setSize(this.width, this.height);
    this.composer.setSize(this.width, this.height);

    const pixelRatio = this.renderer.getPixelRatio();
    this.fxaa.material.uniforms.resolution.value.x =
      (1 / this.width) * pixelRatio;
    this.fxaa.material.uniforms.resolution.value.y =
      (1 / this.height) * pixelRatio;

    this.camera.updateProjectionMatrix();
  }

  update(time) {
    this.heart.rotation.z = Math.sin(Math.PI * 1 + time * 0.2);
    // this.heart.position.y = Math.sin(Math.PI + time) * Math.sin(Math.PI + time) * 0.1;
    // this.heart.rotation.x = Math.sin(Math.PI * 2.0 + time * 0.5)
  }

  render() {
    this.composer.render(this.clock.getDelta());
  }
}
