import { Object3D, Mesh, BoxGeometry, MeshBasicMaterial, MultiMaterial } from 'three';
import preloader from 'lib/Preloader';

export default class Sky extends Object3D {
  constructor(size) {
    super();

    this.geom = new BoxGeometry(size, size, size);
    this.textures = [
      preloader.getTexture('sky_left'),
      preloader.getTexture('sky_right'),
      preloader.getTexture('sky_top'),
      preloader.getTexture('sky_bottom'),
      preloader.getTexture('sky_front'),
      preloader.getTexture('sky_back')
    ];
    const materials = [];
    this.textures.forEach((tex) => {
      materials.push(new MeshBasicMaterial({ map: tex }));
    });

    this.mat = new MultiMaterial(materials);
    this.mesh = new Mesh(this.geom, this.mat);
    this.mesh.scale.set(1, 1, -1);
    this.add(this.mesh);
  }
}
