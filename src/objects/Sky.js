import { Object3D, Mesh, SphereBufferGeometry, MeshBasicMaterial, RepeatWrapping, BackSide } from 'three';
import preloader from 'lib/Preloader';

export default class Sky extends Object3D {
  constructor(size) {
    super();

    this.geom = new SphereBufferGeometry(size, 32, 32);
    // this.textures = [
    //   preloader.getTexture('sky_left'),
    //   preloader.getTexture('sky_right'),
    //   preloader.getTexture('sky_top'),
    //   preloader.getTexture('sky_bottom'),
    //   preloader.getTexture('sky_front'),
    //   preloader.getTexture('sky_back')
    // ];
    // const materials = [];
    // this.textures.forEach((tex) => {
    //   materials.push(new MeshBasicMaterial({ map: tex }));
    // });

    // this.mat = new MultiMaterial(materials);

    this.tex = preloader.getTexture('sky');
    this.tex.wrapS = RepeatWrapping;
    this.tex.wrapT = RepeatWrapping;
    this.tex.repeat.set(1, 3);

    this.mat = new MeshBasicMaterial({
      color: 0x312142,
      map: this.tex,
      side: BackSide,
      fog: false
    });
    this.mesh = new Mesh(this.geom, this.mat);
    this.mesh.position.y = -0.66666 * size;
    this.add(this.mesh);
  }
}
