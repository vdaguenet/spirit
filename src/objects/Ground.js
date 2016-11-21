import { Object3D, PlaneBufferGeometry, Mesh, MeshPhongMaterial, DoubleSide, FlatShading } from 'three';
import preloader from 'lib/Preloader';

export default class Ground extends Object3D {
  constructor(size) {
    super();

    this.size = size;
    this.color = '#9EE1C6'; // '#217E67'; //'#37BEB3';
    this.specular = '#050505';

    this.geom = new PlaneBufferGeometry(size, size, 256, 256);
    this.mat = new MeshPhongMaterial({
      color: this.color,
      specular: this.specular,
      displacementMap: preloader.getTexture('ground_displacement'),
      displacementScale: 40.0,
      side: DoubleSide,
      // shading: FlatShading,
      wireframe: false
    });
    this.mesh = new Mesh(this.geom, this.mat);
    this.mesh.rotation.x = -0.5 * Math.PI;
    this.mesh.receiveShadow = true;
    this.add(this.mesh);
  }
}
