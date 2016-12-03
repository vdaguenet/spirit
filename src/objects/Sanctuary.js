import { Object3D, Sphere, SphereBufferGeometry, MeshBasicMaterial, Mesh,
  Vector3, IcosahedronBufferGeometry, MeshPhongMaterial, FlatShading } from 'three';
import settings from 'lib/settings';
import Spirit from 'objects/Spirit';

export default class Sanctuary extends Object3D {
  constructor() {
    super();

    this.radius = 60;

    this.currentPosition = this.position.clone();
    this.collider = new Sphere(this.currentPosition, this.radius);

    if (settings.debug) {
      this.helper = new Mesh(
        new SphereBufferGeometry(this.radius, 16, 16),
        new MeshBasicMaterial({ color: 0x00FF00, wireframe: true })
      );
      this.add(this.helper);
    }

    this.spirit = new Spirit();
    this.add(this.spirit);

    this.rocks = [];
    this.rockCount = 20;
    this.rockGeom = new IcosahedronBufferGeometry(4, 0);
    this.rockMat = new MeshPhongMaterial({
      color: 0x5e7c91,
      shading: FlatShading
    });
    for (let i = 0; i < this.rockCount; i++) {
      this.rocks.push(new Mesh(this.rockGeom, this.rockMat));
      this.rocks[i].position.x = this.radius * Math.cos(i / this.rockCount * Math.PI * 2);
      this.rocks[i].position.z = this.radius * Math.sin(i / this.rockCount * Math.PI * 2);
      let s = Math.random() * 0.5 + 0.5;
      this.rocks[i].scale.set(s, s, s);
      this.add(this.rocks[i]);
    }
  }

  setPosition(x, y, z) {
    const nextPos = new Vector3(x, y, z);

    let translation = new Vector3();
    translation.subVectors(nextPos, this.currentPosition);
    this.collider.translate(translation);
    for (let i = 0; i < this.rockCount; i++) {
      this.rocks[i].position.x += translation.x;
      this.rocks[i].position.z += translation.z;
    }
    this.currentPosition.set(x, y, z);
    this.spirit.position.set(x, y, z);

    if (settings.debug) {
      this.helper.position.copy(this.currentPosition);
    }
  }

  update(speed) {
    this.setPosition(
      this.currentPosition.x,
      this.currentPosition.y,
      this.currentPosition.z + speed
    );

    this.spirit.update();
  }
}
