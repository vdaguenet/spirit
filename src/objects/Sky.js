import { Object3D, Mesh, SphereBufferGeometry, MeshBasicMaterial, RepeatWrapping, BackSide, MirroredRepeatWrapping } from 'three';
import preloader from 'lib/Preloader';

export default class Sky extends Object3D {
  constructor(size) {
    super();

    this.geom = new SphereBufferGeometry(size, 32, 32);
    this.tex = preloader.getTexture('sky');
    this.tex.wrapS = MirroredRepeatWrapping;
    this.tex.wrapT = RepeatWrapping;
    this.tex.repeat.set(6, 6);

    this.mat = new MeshBasicMaterial({
      color: 0x312142,
      map: this.tex,
      side: BackSide,
      fog: false
    });
    this.mesh = new Mesh(this.geom, this.mat);
    this.mesh.position.y = -0.55 * size;
    this.add(this.mesh);
  }
}
