import { Object3D, MeshPhongMaterial, Mesh, OctahedronBufferGeometry, PointLight, FlatShading } from 'three';
import FeuFollet from 'objects/FeuFollet';

export default class Spirit extends Object3D {
  constructor() {
    super();

    this.cylinderHeight = 500;
    this.currentScale = 1;
    this.rotationSpeed = 0;

    this.geom = new OctahedronBufferGeometry(10, 0);
    this.mat = new MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x05FCFF,
      specular: 0x111111,
      shininess: 100,
      transparent: false,
      opacity: 0.1,
      shading: FlatShading
    });
    this.mesh = new Mesh(this.geom, this.mat);
    this.mesh.position.y = -15;
    this.add(this.mesh);

    this.feuFollet = new FeuFollet();
    this.add(this.feuFollet);

    this.light = new PointLight(0x05FCFF, 0.1, 100);
    this.light.position.y = 20;
    this.add(this.light);

    this.light2 = new PointLight(0x05FCFF, 0.1, 100);
    this.light2.position.y = 100;
    this.add(this.light2);
  }

  activate() {
    let tl = new TimelineMax();
    tl.to(this.mesh.position, 2, { y: 30, ease: Linear.easeNone }, 1);
    tl.to(this, 2, { rotationSpeed: 0.01 }, 1);
    tl.to(this.mat, 0.6, { opacity: 1 }, 1);
    tl.to(this.light, 0.6, { intensity: 1 }, 1);
    tl.to(this.light2, 0.6, { intensity: 5 }, 1.4);
    this.feuFollet.start();
  }

  update() {
    this.feuFollet.update();
    this.mesh.rotation.y += this.rotationSpeed;
  }
}
