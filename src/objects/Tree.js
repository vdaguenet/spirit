import { Object3D, ConeBufferGeometry, Mesh, MeshLambertMaterial, FlatShading } from 'three';

export default class Tree extends Object3D {
  constructor() {
    super();

    this.geom = new ConeBufferGeometry(5, 20, 8);
    this.mat = new MeshLambertMaterial({
      color: '#3E455B', //'#063942',
      shading: FlatShading
    });
    this.mesh = new Mesh(this.geom, this.mat);
    const s = 0.5 + Math.random() * (4 - 0.5);
    this.mesh.scale.set(s, s, s);
    this.mesh.position.set(0, 13 * (s / 2), 0);
    this.mesh.rotation.y = Math.random() * Math.PI;
    this.add(this.mesh);
  }
}
