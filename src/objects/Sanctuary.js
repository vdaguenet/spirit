import { Object3D, Sphere, SphereBufferGeometry, MeshBasicMaterial, Mesh, Vector3 } from 'three';
import state from 'lib/state';
// import Spiral from 'objects/Spiral';

export default class Sanctuary extends Object3D {
  constructor() {
    super();

    this.radius = 100;

    this.currentPosition = this.position.clone();
    this.collider = new Sphere(this.currentPosition, this.radius);

    if (state.debug) {
      this.helper = new Mesh(
        new SphereBufferGeometry(this.radius, 16, 16),
        new MeshBasicMaterial({ color: 0x00FF00, wireframe: true })
      );
      this.add(this.helper);
    }

    // this.spirals = [];
    // this.spiralCount = 1;
    // for (let i = 0; i < this.spiralCount; i++) {
    //   this.spirals[i] = new Spiral();
    //   this.spirals[i].rotation.y = i * (2 * Math.PI / this.spiralCount);
    //   this.add(this.spirals[i]);
    // }
  }

  setPosition(x, y, z) {
    const nextPos = new Vector3(x, y, z);

    let translation = new Vector3();
    translation.subVectors(nextPos, this.currentPosition);
    this.collider.translate(translation);

    this.currentPosition.set(x, y, z);

    // for (let i = 0; i < this.spiralCount; i++) {
    //   this.spirals[i].position.set(x, y, z);
    // }

    if (state.debug) {
      this.helper.position.copy(this.currentPosition);
    }
  }

  update(speed) {
    this.setPosition(
      this.currentPosition.x,
      this.currentPosition.y,
      this.currentPosition.z + speed
    );

    // for (let i = 0; i < this.spiralCount; i++) {
    //   this.spirals[i].update();
    // }
  }
}
