import { Object3D, MeshPhongMaterial, Mesh, CylinderBufferGeometry, PointLight } from 'three';
import Mediator from 'lib/Mediator';
import FeuFollet from 'objects/FeuFollet';

export default class Spirit extends Object3D {
  constructor() {
    super();

    this.cylinderHeight = 500;
    this.currentScale = 1;

    this.geom = new CylinderBufferGeometry(3, 3, this.cylinderHeight, 32);
    this.mat = new MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x05FCFF,
      specular: 0x111111,
      shininess: 100,
      transparent: true,
      opacity: 0.1
    });
    this.mesh = new Mesh(this.geom, this.mat);
    this.mesh.position.y = this.currentScale * 0.5 * this.cylinderHeight;
    this.add(this.mesh);

    this.feuFollet = new FeuFollet();
    this.add(this.feuFollet);

    this.light = new PointLight(0x05FCFF, 0.1, 100);
    this.light.position.y = 10;
    this.add(this.light);

    this.light2 = new PointLight(0x05FCFF, 0.1, 100);
    this.light2.position.y = 100;
    this.add(this.light2);
  }

  activate() {
    let tl = new TimelineMax();
    tl.to(this.mat, 0.6, { opacity: 1 }, 0);
    tl.to(this.light, 0.6, { intensity: 1 }, 0);
    tl.to(this.light2, 0.6, { intensity: 5 }, 0.4);
    this.feuFollet.start();
  }

  update() {
    this.feuFollet.update();
  }
}
