import { Object3D, Vector3 } from 'three';
import Tree from 'objects/Tree';

export default class Forest extends Object3D {
  constructor(width, height) {
    super();

    this.width = width;
    this.height = height;
    this.treeCount = 400;
    this.trees = [];
  }

  populate(sanctuary) {
    let i = 0

    while (i < this.treeCount) {
      let x = -0.5 * this.width + Math.random() * (0.5 * this.width - -0.5 * this.width);
      // create path
      if (x > -20 && x < 20) {
        continue;
      }
      let z = -0.5 * this.height + Math.random() * (0.5 * this.height - -0.5 * this.height);

      const pos = new Vector3(x, 0, z);

      if (sanctuary.collider.containsPoint(pos)) {
        continue;
      }

      this.trees[i] = new Tree();
      this.trees[i].position.copy(pos);
      this.add(this.trees[i]);

      i++;
    }
  }

  update(speed) {
    this.position.z += speed;
  }
}
