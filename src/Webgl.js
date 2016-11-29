import {
  Scene, PerspectiveCamera, WebGLRenderer, Clock, HemisphereLight,
  DirectionalLight, DirectionalLightHelper, FogExp2,
  Sphere, SphereBufferGeometry, MeshBasicMaterial, Mesh } from 'three';
import TweenMax from 'gsap';
import state from 'lib/state';
import Mediator from 'lib/Mediator';
import preloader from 'lib/Preloader';
import DisplacementManager from 'lib/DisplacementManager';
import WAGNER from 'lib/Wagner';
import FXAAPass from 'lib/Wagner/src/passes/fxaa/FXAAPass';
import VignettePass from 'lib/Wagner/src/passes/vignette/VignettePass';
import OrbitControls from 'lib/OrbitControls';
import Elk from 'objects/Elk';
import Ground from 'objects/Ground';
import Sky from 'objects/Sky';
import Forest from 'objects/Forest';
import Sanctuary from 'objects/Sanctuary';
import Mountain from 'objects/Mountain';

export default class Webgl {
  constructor(width, height) {
    this.isReady = false;
    this.isRunning = false;
    this.hasStopped = false;

    this.params = {
      usePostprocessing: false,
      runSpeed: 2
    };
    state.world.start = 0.5 * state.world.height;

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

    this.fog = {
      color: '#171A2C',
      density: 0.0025
    };

    this.scene = new Scene();
    this.scene.fog = new FogExp2(this.fog.color, this.fog.density);

    this.camera = new PerspectiveCamera(50, width / height, 1, 10000);
    this.camera.position.y = 20;
    this.camera.position.z = state.world.start + 50;
    this.camera.lookAt(0, 20, state.world.height);

    this.initLights();

    this.renderer = new WebGLRenderer({ antialising: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x262626);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.composer = new WAGNER.Composer(this.renderer);
    this.initPostprocessing();

    this.mountain = new Mountain();
    this.mountain.position.set(-800, 0, 0);
    this.scene.add(this.mountain);

    this.sanctuary = new Sanctuary();
    this.sanctuary.setPosition(0, 0, state.world.end);
    this.scene.add(this.sanctuary);

    this.elk = new Elk();
    this.elk.position.set(0, 0, state.world.start - 30);
    this.scene.add(this.elk);

    this.elkCollider = new Sphere(this.elk.position.clone(), 20);
    if (state.debug) {
      this.elkColliderHelper = new Mesh(
        new SphereBufferGeometry(20, 16, 16),
        new MeshBasicMaterial({ color: 0x00FF00, wireframe: true })
      );
      this.elkColliderHelper.position.copy(this.elk.position);
      this.scene.add(this.elkColliderHelper);
    }

    this.clock = new Clock();
  }

  onLoaderComplete() {
    DisplacementManager.setHeightmap(preloader.getImage('heightmap'));

    this.sky = new Sky(Math.max(state.world.width, state.world.height));
    this.sky.position.copy(this.camera.position);
    this.scene.add(this.sky);

    this.ground = new Ground(state.world.width, state.world.height);
    this.ground.position.set(0, 0, 0);
    this.scene.add(this.ground);

    this.forest = new Forest(state.world.width, state.world.height);
    this.forest.position.set(0, 0, 0);
    this.forest.populate(this.sanctuary);
    this.scene.add(this.forest);

    this.isReady = true;
  }

  initLights() {
    this.hemiLight = new HemisphereLight(this.lights.hemisphere.color, this.lights.hemisphere.groundColor, 0.6);
    this.hemiLight.position.set(0, 500, 0);
    this.hemiLight.castShadow = true;
    this.scene.add(this.hemiLight);

    this.directionalLigth = new DirectionalLight(this.lights.directional.color, this.lights.directional.intencity);
    this.directionalLigth.castShadow = true;
    this.directionalLigth.position.set(0, 120, 335);
    this.scene.add(this.directionalLigth);
    if (state.debug) {
      this.dirLightHelper = new DirectionalLightHelper(this.directionalLigth, 10);
      this.scene.add(this.dirLightHelper);
    }
  }

  initPostprocessing() {
    this.fxaaPass = new FXAAPass();
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
    this.hasStopped = true;
    this.elk.stopAnimation(true);
    TweenMax.to(this.params, 1.2, { runSpeed: 0, onComplete: () => {
      this.isRunning = false;
    } });
    Mediator.emit('run:end');
  }

  update() {
    if (!this.isReady) { return; }

    let delta = this.clock.getDelta();
    this.controls.update();
    if (this.isRunning) {
      this.ground.update(this.params.runSpeed);
      this.sanctuary.update(this.params.runSpeed);
      this.forest.update(this.params.runSpeed);

      if (!this.hasStopped && this.sanctuary.collider.intersectsSphere(this.elkCollider)) {
        this.stopRun();
      }
    }
    this.elk.update(delta);


    if (state.debug) {
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
