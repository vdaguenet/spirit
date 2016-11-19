import { Scene, PerspectiveCamera, WebGLRenderer, Clock, HemisphereLight } from 'three';
import WAGNER from 'lib/Wagner';
import FXAAPass from 'lib/Wagner/src/passes/fxaa/FXAAPass';
import VignettePass from 'lib/Wagner/src/passes/vignette/VignettePass';
import OrbitControls from 'lib/OrbitControls';
import Elk from 'objects/Elk';
import Ground from 'objects/Ground';
import Sky from 'objects/Sky';

export default class Webgl {
  constructor(width, height) {
    this.params = {
      usePostprocessing: false,
      worldSize: 800
    };

    this.lights = {
      hemisphere: {
        color: '#BBFFFC',
        groundColor: '#080820'
      }
    };

    this.scene = new Scene();

    this.camera = new PerspectiveCamera(50, width / height, 1, 1000);
    this.camera.position.y = 20;
    this.camera.position.z = 100;
    this.camera.lookAt(0, 20, 0);

    this.initLights();

    this.renderer = new WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x262626);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.composer = new WAGNER.Composer(this.renderer);
    this.initPostprocessing();

    this.elk = new Elk();
    this.elk.position.set(0, 0, 0);
    this.scene.add(this.elk);

    this.ground = new Ground(this.params.worldSize);
    this.ground.position.set(0, 0, 0);
    this.scene.add(this.ground);

    this.clock = new Clock();
  }

  onLoaderComplete() {
    this.sky = new Sky(0.8 * this.params.worldSize);
    this.sky.position.set(0, 0.3 * this.params.worldSize, 0);
    this.scene.add(this.sky);
  }

  initLights() {
    this.hemiLight = new HemisphereLight(this.lights.hemisphere.color, this.lights.hemisphere.groundColor, 0.6);
    this.hemiLight.position.set(0, 500, 0);
    this.scene.add(this.hemiLight);
  }

  initPostprocessing() {
    // FXAA
    this.fxaaPass = new FXAAPass();
    // Vignette
    this.vignettePass = new VignettePass();
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
    this.controls.update();
    this.elk.update(delta);
  }

  render() {
    if (this.params.usePostprocessing) {
      this.composer.reset();
      this.composer.render(this.scene, this.camera);
      this.composer.pass(this.fxaaPass);
      this.composer.pass(this.vignettePass);
      this.composer.toScreen();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
