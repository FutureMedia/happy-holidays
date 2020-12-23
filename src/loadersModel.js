import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const gltfLoader = new GLTFLoader();

export default (model) => {
  return new Promise(resolve => {
    gltfLoader.load(model, data => {
      resolve(data);
    });
  });
};
