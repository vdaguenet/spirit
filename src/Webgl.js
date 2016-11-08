import { Scene, PerspectiveCamera, WebGLRenderer, Clock } from 'three';
import Elk from 'objects/Elk.js';

export default class Webgl {
  constructor(width, height) {
    this.params = {
      usePostprocessing: false
    };

    this.scene = new Scene();

    this.camera = new PerspectiveCamera(50, width / height, 1, 1000);
    this.camera.position.z = 100;

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x262626);

    this.composer = undefined;
    this.initPostprocessing();

    this.elk = new Elk();
    this.scene.add(this.elk);

    this.clock = new Clock();
  }

  initPostprocessing() {
    if (!this.params.usePostprocessing) { return; }

    /* Add the effect composer of your choice */
  }

  resize(width, height) {
    if (this.composer) {
      this.composer.setSize(width, height);
    }

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  update() {
    let delta = this.clock.getDelta();
    this.elk.update(delta);
  }

  render() {
    if (this.params.usePostprocessing) {
      console.warn('WebGL - No effect composer set.');
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
