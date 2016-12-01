import { Object3D, BufferGeometry, BufferAttribute, ShaderMaterial, Points } from 'three';

export default class Spiral extends Object3D {
  constructor() {
    super();

    this.particlesCount = 1000;
    this.positions = new Float32Array(this.particlesCount * 3);
    this.sizes = new Float32Array(this.particlesCount * 1);
    this.radiuses = new Float32Array(this.particlesCount * 1);
    this.thetas = new Float32Array(this.particlesCount * 1);

    const height = 50;
    const radiusStart = 100;
    const radiusEnd = 10;
    let radius = radiusEnd;
    const alpha = Math.PI / 32;
    const revolutions = 5;
    this.radiusStep = height / (radiusStart - radiusEnd);
    this.radiusMax = this.radiusStep * this.particlesCount;

    for (let i = 0; i < this.particlesCount; i ++) {
      const theta = (i / this.particlesCount) * (Math.PI * 2) * revolutions;
      this.positions[i * 3] = 0; // x
      this.positions[i * 3 + 1] = 0; // y
      this.positions[i * 3 + 2] = 0; // z

      this.sizes[i] = 2;
      this.radiuses[i] = radius;
      this.thetas[i] = theta;

      // radius += this.radiusStep;
    }

    this.geom = new BufferGeometry();
    this.geom.addAttribute('position', new BufferAttribute(this.positions, 3));
    this.geom.addAttribute('size', new BufferAttribute(this.sizes, 1));
    this.geom.addAttribute('radius', new BufferAttribute(this.radiuses, 1));
    this.geom.addAttribute('theta', new BufferAttribute(this.thetas, 1));
    this.geom.computeBoundingSphere();

    this.mat = new ShaderMaterial({
      vertexShader: require('shaders/spiral.vert'),
      fragmentShader: require('shaders/spiral.frag'),
      uniforms: {
        alpha: { type: 'f', value: alpha },
        maxHeight: { type: 'f', value: this.radiusMax }
      },
      transparent: true
    });

    this.particles = new Points(this.geom, this.mat);
    // this.particles.position.y = -this.radiusMax;
    this.add(this.particles);
  }

  update() {
    // this.rotation.y -= 0.01;
  }
}
