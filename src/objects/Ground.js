import { Object3D, PlaneBufferGeometry, MeshPhongMaterial, Mesh } from 'three';

export default class Ground extends Object3D {
  constructor(size) {
    super();

    this.size = size;
    this.color = '#37BEB3';
    this.specular = '#050505';

    this.geom = new PlaneBufferGeometry(size, size);
    this.mat = new MeshPhongMaterial({ color: this.color, specular: this.specular });
    this.mesh = new Mesh(this.geom, this.mat);
    this.mesh.rotation.x = -0.5 * Math.PI;
    this.mesh.receiveShadow = true;
    this.add(this.mesh);
  }
}
