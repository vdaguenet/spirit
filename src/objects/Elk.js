import { Object3D, Mesh, JSONLoader, MultiMaterial, AnimationMixer } from 'three';
import bindAll from 'lodash.bindall';

export default class Elk extends Object3D {
  constructor() {
    super();
    bindAll(this, 'onModelLoaded');

    this.material = undefined;
    this.geometry = undefined;
    this.mesh = undefined;
    this.animator = undefined;
    this.clip = undefined;

    this.isReady = false;

    const loader = new JSONLoader();
    loader.load('./assets/models/elk.js', this.onModelLoaded);
  }

  onModelLoaded(geometry, materials) {
    this.material = new MultiMaterial(materials).materials[0];
    this.material.morphTargets = true;
    this.material.wireframe = true;
    this.geometry = geometry;
    this.mesh = new Mesh(geometry, this.material);
    this.mesh.scale.set(0.2, 0.2, 0.2);
    this.add(this.mesh);
    this.animator = new AnimationMixer(this.mesh);
    this.clip = this.animator.clipAction(geometry.animations[0]).setDuration(1);
    this.isReady = true;
    this.startAnimation();
  }

  startAnimation(fade = false) {
    this.clip.play();
    if (fade === true) {
      this.clip.fadeIn(5);
    }
  }

  stopAnimation(fade = false) {
    if (fade === true) {
      this.clip.fadeOut(5);
    } else {
      this.clip.stop();
    }
  }

  update(dt) {
    if (!this.isReady) { return; }

    this.animator.update(dt);
    this.rotation.y += 0.01;
  }
}
