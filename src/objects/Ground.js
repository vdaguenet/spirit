import { Object3D, PlaneBufferGeometry, Mesh, MeshPhongMaterial, Texture } from 'three';
import preloader from 'lib/Preloader';
import Mediator from 'lib/Mediator';

export default class Ground extends Object3D {
  constructor(width, height) {
    super();

    this.width = width;
    this.height = height;
    this.color = '#9EE1C6'; // #6F9BA2 '#217E67'; //'#37BEB3';
    this.specular = '#050505';

    this.heightMap = preloader.getImage('heightmap');

    this.updateSpeed = 2;

    this.$displacementCanvas = document.createElement('canvas');
    this.$displacementCanvas.width = 256;
    this.$displacementCanvas.height = 256;
    this.displacementCtx = this.$displacementCanvas.getContext('2d');
    this.displacementTexture = new Texture(this.$displacementCanvas);

    this.geom = new PlaneBufferGeometry(this.width, this.height, 256, 256);
    this.mat = new MeshPhongMaterial({
      color: this.color,
      specular: this.specular,
      // map: this.displacementTexture,
      displacementMap: this.displacementTexture,
      displacementScale: 30.0,
      wireframe: false
    });
    this.mesh = new Mesh(this.geom, this.mat);
    this.mesh.rotation.x = -0.5 * Math.PI;
    this.mesh.receiveShadow = true;
    this.add(this.mesh);

    this.drawHeightMap();
  }

  drawHeightMap() {
    this.displacementCtx.clearRect(0, 0, this.$displacementCanvas.width, this.$displacementCanvas.height);
    this.displacementCtx.drawImage(
      this.heightMap,
      0, 0,
      this.$displacementCanvas.width, this.$displacementCanvas.height
    );
    this.displacementTexture.needsUpdate = true;
  }

  update(speed) {
    this.position.z += speed;
  }
}
