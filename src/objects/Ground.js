import { Object3D, PlaneBufferGeometry, Mesh, MeshPhongMaterial } from 'three';
import DisplacementManager from 'lib/DisplacementManager';

export default class Ground extends Object3D {
  constructor(width, height) {
    super();

    this.width = width;
    this.height = height;
    this.color = '#9EE1C6'; // #6F9BA2 '#217E67'; //'#37BEB3';
    this.specular = '#050505';

    this.geom = new PlaneBufferGeometry(this.width, this.height, 256, 1024);
    this.mat = new MeshPhongMaterial({
      color: this.color,
      specular: this.specular,
      // map: DisplacementManager.getTexture(),
      displacementMap: DisplacementManager.getTexture(),
      displacementScale: 30.0,
      wireframe: false
    });
    this.mesh = new Mesh(this.geom, this.mat);
    this.mesh.rotation.x = -0.5 * Math.PI;
    this.mesh.receiveShadow = true;
    this.add(this.mesh);
  }

  update(speed) {
    this.position.z += speed;
  }
}
