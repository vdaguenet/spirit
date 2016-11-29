import { Texture } from 'three';

class DisplacementManager {
  constructor() {
    this.mapIsDrawn = false;

    this.heightmap = undefined;

    this.$canvas = document.createElement('canvas');
    this.$canvas.width = 256;
    this.$canvas.height = 256;
    this.ctx = this.$canvas.getContext('2d');
    this.texture = new Texture(this.$canvas);
  }

  drawHeightMap() {
    this.ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
    this.ctx.drawImage(
      this.heightmap,
      0, 0,
      this.$canvas.width, this.$canvas.height
    );
    this.heightdata = this.ctx.getImageData(0, 0, this.$canvas.width, this.$canvas.height).data;
    this.texture.needsUpdate = true;
    this.mapIsDrawn = true;
  }

  setHeightmap(map) {
    this.heightmap = map;
  }

  getTexture() {
    if (this.heightmap === undefined) { return; }

    if (!this.mapIsDrawn) {
      this.drawHeightMap();
    }

    return this.texture;
  }

  getElevationAtPoint(nx, ny) {
    const x = nx * this.$canvas.width;
    const y = ny * this.$canvas.height;

    const rawCount = Math.floor(y / this.$canvas.width);
    const i = rawCount * this.$canvas.width + Math.floor(x);
    const r = this.heightdata[i * 4];
    const g = this.heightdata[i * 4 + 1];
    const b = this.heightdata[i * 4 + 2];
    const a = this.heightdata[i * 4 + 3];

    return r / 255;
  }
}

export default new DisplacementManager();
