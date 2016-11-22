import { Object3D, PlaneBufferGeometry, Mesh, MeshPhongMaterial, DoubleSide, Texture, FlatShading } from 'three';
import preloader from 'lib/Preloader';
import Mediator from 'lib/Mediator';

export default class Ground extends Object3D {
  constructor(size) {
    super();

    this.size = size;
    this.color = '#9EE1C6'; // '#217E67'; //'#37BEB3';
    this.specular = '#050505';

    this.heightMap = preloader.getImage('heightmap');

    this.currentY = 0;
    this.updateSpeed = 1;
    this.maxDistance = this.heightMap.height;

    this.$displacementCanvas = document.createElement('canvas');
    this.$displacementCanvas.width = 256;
    this.$displacementCanvas.height = 256;
    this.displacementCtx = this.$displacementCanvas.getContext('2d');
    this.displacementTexture = new Texture(this.$displacementCanvas);

    this.geom = new PlaneBufferGeometry(size, size, 256, 256);
    this.mat = new MeshPhongMaterial({
      color: this.color,
      specular: this.specular,
      displacementMap: this.displacementTexture,
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

  drawHeightMap() {
    this.displacementCtx.clearRect(0, 0, this.$displacementCanvas.width, this.$displacementCanvas.height);
    this.displacementCtx.drawImage(
      this.heightMap,
      0, this.currentY,
      this.$displacementCanvas.width, this.$displacementCanvas.height
    );
  }

  update() {
    if (this.currentY < this.maxDistance) {
      this.currentY += this.updateSpeed;
      this.drawHeightMap();
      this.displacementTexture.needsUpdate = true;
    } else {
      Mediator.emit('run:end');
    }
  }
}
