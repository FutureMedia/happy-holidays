import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class BasicThree {
  constructor(container) {
    this.container = container;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.01, 1000);
    this.scene = new THREE.Scene();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.clock = new THREE.Clock();
    this.loader = new THREE.TextureLoader()
    
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.width, this.height)

    this.camera.position.z = 2;
    this.camera.position.y = 0.25;  

    this.renderer.outputEncoding = THREE.sRGBEncoding

    this.container.appendChild(this.renderer.domElement);
  }
  
  init() {
    this.tick();
  }

  update(time) {}

  resize(){
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.camera.aspect = this.width / this.height;
    this.renderer.setSize(this.width, this.height);
    this.camera.updateProjectionMatrix();
  }

  render(){
    this.renderer.render(this.scene, this.camera);
  }
  
  tick() {
    this.renderer.setAnimationLoop(() => {
      const time = this.clock.getElapsedTime() * 4.0
      
      this.update(time);
      this.render()
    });
  }
}
