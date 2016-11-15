import { Object3D, Mesh, JSONLoader, MeshPhongMaterial, AnimationMixer, FlatShading, PointLight } from 'three';
import bindAll from 'lodash.bindall';

export default class Elk extends Object3D {
  constructor() {
    super();
    bindAll(this, 'onModelLoaded');

    this.color = '#ffffff';
    this.emissive = '#b7c5cf';
    this.specular = '#547388';

    this.material = new MeshPhongMaterial({
      color: this.color,
      emissive: this.emissive,
      specular: this.specular,
      shininess: 0,
      morphTargets: true,
      shading: FlatShading
    });

    this.light = new PointLight(this.emissive, 2, 35, 2);
    this.light.position.set(0, 12, 0);
    this.light.castShadow = true;
    this.add(this.light);

    this.isReady = false;

    const loader = new JSONLoader();
    loader.load('./assets/models/elk.js', this.onModelLoaded);
  }

  onModelLoaded(geometry, materials) {
    this.geometry = geometry;
    this.mesh = new Mesh(geometry, this.material);
    this.mesh.scale.set(0.2, 0.2, 0.2);
    this.mesh.castShadow = true;
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
    this.rotation.y += 0.001;
  }
}
