import { Object3D, Shape, ShapeGeometry, ShaderMaterial, Color, Mesh } from 'three';
import terPoints from 'models/mountain';

// from https://github.com/superguigui/polar/blob/master/src/js/objects/Mountain.js
export default class Mountain extends Object3D {
  constructor() {
    super();

    let offset = 1;
    const sub = 100;
    const stepLength = 4;
    const shape = new Shape();
    shape.moveTo(0, terPoints[0] - sub);
    for (let i = 1, l = terPoints.length; i < l; i++) {
      shape.lineTo(offset, terPoints[i] - sub);
      offset += stepLength;
    }
    for (let i = terPoints.length - 1; i > 0; i--) {
      shape.lineTo(offset, terPoints[i] - sub);
      offset += stepLength;
    }
    shape.lineTo(offset, 0);
    shape.lineTo(0, 0);
    shape.lineTo(0, terPoints[0] - sub);

    this.colorTop = '#1B2A3F';
    this.colorBottom = '#151F2E';

    this.meshWidth = terPoints.length * stepLength * 2;
    this.geom = new ShapeGeometry(shape);
    this.mat = new ShaderMaterial({
      vertexShader: require('shaders/mountain.vert'),
      fragmentShader: require('shaders/mountain.frag'),
      uniforms: {
        maxheight: { type: 'f', value: 200.0 },
        colorTop: { type: 'c', value: new Color(this.colorTop) },
        colorBottom: { type: 'c', value: new Color(this.colorBottom) }
      }
    });

    this.mesh1 = new Mesh(this.geom, this.mat);
    this.mesh1.position.x -= this.meshWidth * 0.5;

    this.mesh2 = this.mesh1.clone();
    this.mesh2.position.x = this.mesh1.position.x + this.meshWidth - 10;

    this.add(this.mesh1);
    this.add(this.mesh2);

    this.scale.multiplyScalar(1.5);
  }
}
