import {
  Scene, PerspectiveCamera, WebGLRenderer, Clock, HemisphereLight,
  DirectionalLight, DirectionalLightHelper, FogExp2,
  Sphere, SphereBufferGeometry, MeshBasicMaterial, Mesh } from 'three';
import TweenMax from 'gsap';
import settings from 'lib/settings';
import Mediator from 'lib/Mediator';
import preloader from 'lib/Preloader';
import DisplacementManager from 'lib/DisplacementManager';
import WAGNER from 'lib/Wagner';
import FXAAPass from 'lib/Wagner/src/passes/fxaa/FXAAPass';
import VignettePass from 'lib/Wagner/src/passes/vignette/VignettePass';
import OrbitControls from 'lib/OrbitControls';
import CameraDriver from 'lib/CameraDriver';
import Elk from 'objects/Elk';
import Ground from 'objects/Ground';
import Sky from 'objects/Sky';
import Forest from 'objects/Forest';
import Sanctuary from 'objects/Sanctuary';
import Mountain from 'objects/Mountain';
import Snow from 'objects/Snow';

export default class Webgl {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.isReady = false;
    this.isRunning = false;
    this.hasStopped = false;

    settings.world.start = 0.5 * settings.world.height;

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
    this.camera.position.x = 0;
    this.camera.position.y = 20;
    this.camera.position.z = settings.world.start + 50;
    // this.camera.position.set(0, 20, settings.world.end + 200);

    this.camera.lookAt(0, 20, settings.world.height);
    // this.camera.lookAt(0, 20, settings.world.end);

    this.cameraDriver = new CameraDriver(this.camera);

    this.initLights();

    this.renderer = new WebGLRenderer({ antialising: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000);

    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.composer = new WAGNER.Composer(this.renderer);
    this.initPostprocessing();

    this.mountain = new Mountain();
    this.mountain.position.set(-800, 0, 0);
    this.scene.add(this.mountain);

    this.elk = new Elk();
    this.elk.position.set(0, 0, settings.world.start - 30);
    this.scene.add(this.elk);

    this.elkCollider = new Sphere(this.elk.position.clone(), 20);
    if (settings.debug) {
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

    this.sky = new Sky(Math.max(settings.world.width, settings.world.height));
    this.sky.position.copy(this.camera.position);
    this.scene.add(this.sky);

    this.snow = new Snow();
    this.snow.position.z = settings.world.start;
    this.scene.add(this.snow);

    this.ground = new Ground(settings.world.width, settings.world.height);
    this.ground.position.set(0, 0, 0);
    this.scene.add(this.ground);

    this.sanctuary = new Sanctuary();
    this.sanctuary.setPosition(0, 0, settings.world.end);
    this.scene.add(this.sanctuary);

    this.forest = new Forest(settings.world.width, settings.world.height);
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
    if (settings.debug) {
      this.dirLightHelper = new DirectionalLightHelper(this.directionalLigth, 10);
      this.scene.add(this.dirLightHelper);
    }
  }

  initPostprocessing() {
    this.fxaaPass = new FXAAPass();
    this.vignettePass = new VignettePass();
  }

  resize(width, height) {
    this.width = width;
    this.height = height;

    if (this.composer) {
      this.composer.setSize(width, height);
    }

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  startRun() {
    this.isRunning = true;
    this.elk.startAnimation(false);
    this.cameraDriver.start();
  }

  stopRun() {
    this.hasStopped = true;
    this.elk.stopAnimation(true);
    TweenMax.to(settings, 1.2, { runSpeed: 0, onComplete: () => {
      this.isRunning = false;
    } });
    this.sanctuary.spirit.activate();
    Mediator.emit('run:end');
  }

  update() {
    if (!this.isReady) { return; }

    let delta = this.clock.getDelta();
    // this.controls.update();
    if (this.isRunning) {
      this.ground.update(settings.runSpeed);
      this.forest.update(settings.runSpeed);

      if (!this.hasStopped && this.sanctuary.collider.intersectsSphere(this.elkCollider)) {
        this.stopRun();
      }
    }
    this.sanctuary.update(settings.runSpeed);
    this.elk.update(delta);
    this.snow.update();

    if (settings.debug) {
      this.dirLightHelper.update();
    }
  }

  render() {
    if (settings.usePostprocessing) {
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
