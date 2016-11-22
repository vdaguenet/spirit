import { Scene, PerspectiveCamera, WebGLRenderer, Clock, HemisphereLight, DirectionalLight, DirectionalLightHelper } from 'three';
import WAGNER from 'lib/Wagner';
import FXAAPass from 'lib/Wagner/src/passes/fxaa/FXAAPass';
import VignettePass from 'lib/Wagner/src/passes/vignette/VignettePass';
import OrbitControls from 'lib/OrbitControls';
import Elk from 'objects/Elk';
import Ground from 'objects/Ground';
import Sky from 'objects/Sky';

const DEBUG = true;

export default class Webgl {
  constructor(width, height) {
    this.isReady = false;
    this.isRunning = false;

    this.params = {
      usePostprocessing: false,
      worldSize: 800
    };

    this.lights = {
      hemisphere: {
        color: '#262A45', // '#BBFFFC',
        groundColor: '#E4D19C' // '#080820'
      },
      directional: {
        color: '#A193FA', // #FAAA93
        intencity: 0.5
      }
    };

    this.scene = new Scene();

    this.camera = new PerspectiveCamera(50, width / height, 1, 1000);
    this.camera.position.y = 30;
    this.camera.position.z = 100;
    this.camera.lookAt(0, 20, 0);

    this.initLights();

    this.renderer = new WebGLRenderer({ antialising: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x262626);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.composer = new WAGNER.Composer(this.renderer);
    this.initPostprocessing();

    this.elk = new Elk();
    this.elk.position.set(0, 0, 0);
    this.scene.add(this.elk);

    this.clock = new Clock();
  }

  onLoaderComplete() {
    this.sky = new Sky(0.8 * this.params.worldSize);
    this.sky.position.set(0, 0.3 * this.params.worldSize, 0);
    this.scene.add(this.sky);

    this.ground = new Ground(this.params.worldSize);
    this.ground.position.set(0, 0, 0);
    this.scene.add(this.ground);

    this.isReady = true;
  }

  initLights() {
    this.hemiLight = new HemisphereLight(this.lights.hemisphere.color, this.lights.hemisphere.groundColor, 0.6);
    this.hemiLight.position.set(0, 500, 0);
    this.hemiLight.castShadow = true;
    this.scene.add(this.hemiLight);

    this.directionalLigth = new DirectionalLight(this.lights.directional.color, this.lights.directional.intencity);
    this.directionalLigth.castShadow = true;
    this.directionalLigth.position.set(0, 120, -335);
    this.scene.add(this.directionalLigth);
    if (DEBUG) {
      this.dirLightHelper = new DirectionalLightHelper(this.directionalLigth, 10);
      this.scene.add(this.dirLightHelper);
    }
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

  startRun() {
    this.elk.startAnimation(false);
    this.isRunning = true;
  }

  stopRun() {
    this.elk.stopAnimation(true);
    this.isRunning = false;
  }

  update() {
    if (!this.isReady) { return; }

    let delta = this.clock.getDelta();
    this.controls.update();
    if (this.isRunning) {
      this.ground.update();
    }
    this.elk.update(delta);

    if (DEBUG) {
      this.dirLightHelper.update();
    }
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
