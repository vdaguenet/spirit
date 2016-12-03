import { Object3D, Vector3, Math } from 'three';
import Tree from 'objects/Tree';
import settings from 'lib/settings';
import DisplacementManager from 'lib/DisplacementManager';

export default class Forest extends Object3D {
  constructor(width, height) {
    super();

    this.width = width;
    this.height = height;
    this.treeCount = 600;
    this.trees = [];
  }

  populate(sanctuary) {
    let i = 0

    while (i < this.treeCount) {
      const x = -0.5 * this.width + window.Math.random() * (0.5 * this.width - -0.5 * this.width);
      // create path
      if (x > -30 && x < 30) {
        continue;
      }
      const z = -0.5 * this.height + window.Math.random() * (0.5 * this.height - -0.5 * this.height);
      const nx = (x + settings.world.width * 0.5) / settings.world.width;
      const ny = (-1 * (z - settings.world.height * 0.5)) / settings.world.height;
      const y = DisplacementManager.getElevationAtPoint(nx, ny);

      let f = 0;
      if (nx < 0.5) {
        f = Math.smoothstep(nx, 0, 0.5);
      } else {
        f = 1 - Math.smoothstep(nx, 0.5, 1);
      }

      const pos = new Vector3(x, (y - f) * 30, z);

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
