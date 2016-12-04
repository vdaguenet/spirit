import { Object3D, BufferGeometry, PointsMaterial, Points, BufferAttribute, AdditiveBlending } from 'three';
import preloader from 'lib/Preloader';

export default class FeuFollet extends Object3D {
  constructor() {
    super();
    this.particlesCount = 75;

    this.positions = new Float32Array(this.particlesCount * 3);
    this.velocities = new Float32Array(this.particlesCount * 3);

    this.positionsSmall = new Float32Array(this.particlesCount * 3);

    this.speedFactor = 0;

    this.zone = {
      x: 40,
      y: 75,
      z: 40
    };

    for (let i = 0; i < this.particlesCount; i++) {
      this.positions[i * 3 + 0] = Math.random() * this.zone.x - 0.5 * this.zone.x; // x
      this.positions[i * 3 + 1] = -10; // y
      this.positions[i * 3 + 2] = Math.random() * this.zone.z - 0.5 * this.zone.z; // z

      this.positionsSmall[i * 3 + 0] = Math.random() * this.zone.x * 2 - 0.5 * this.zone.x * 2; // x
      this.positionsSmall[i * 3 + 1] = 0; // y
      this.positionsSmall[i * 3 + 2] = Math.random() * this.zone.z * 2 - 0.5 * this.zone.z * 2; // z

      this.velocities[i * 3] = Math.random() * 0.2 - 0.5 * 0.2; // x
      this.velocities[i * 3 + 1] = Math.random() * 0.2; // y
      this.velocities[i * 3 + 2] = Math.random() * 0.2 - 0.5 * 0.2; // z
    }

    this.geom = new BufferGeometry();
    this.geom.addAttribute('position', new BufferAttribute(this.positions, 3));
    this.mat = new PointsMaterial({
      color: 0x00FFFF,
      size: 3,
      map: preloader.getTexture('snowflake'),
      transparent: true,
      blending: AdditiveBlending
    });
    this.particles = new Points(this.geom, this.mat);
    this.add(this.particles);

    this.geomSmall = new BufferGeometry();
    this.geomSmall.addAttribute('position', new BufferAttribute(this.positionsSmall, 3));
    this.matSmall = new PointsMaterial({
      color: 0x00FFFF,
      size: 1,
      map: preloader.getTexture('snowflake'),
      transparent: true,
      blending: AdditiveBlending
    });
    this.particlesSmall = new Points(this.geomSmall, this.matSmall);
    this.add(this.particlesSmall);
  }

  start() {
    this.speedFactor = 1;
  }

  update() {
    for (let i = 0; i < this.particlesCount; i ++) {
      this.positions[i * 3 + 0] += this.velocities[i * 3 + 0] * this.speedFactor;
      this.positions[i * 3 + 1] += this.velocities[i * 3 + 1] * this.speedFactor;
      this.positions[i * 3 + 2] += this.velocities[i * 3 + 2] * this.speedFactor;

      if (this.positions[i * 3 + 1] > this.zone.y) {
        this.positions[i * 3 + 0] = Math.random() * this.zone.x - 0.5 * this.zone.x; // x
        this.positions[i * 3 + 1] = 0; // y
        this.positions[i * 3 + 2] = Math.random() * this.zone.z - 0.5 * this.zone.z; // z
      }

      this.positionsSmall[i * 3 + 0] += this.velocities[i * 3 + 0] * 0.5;
      this.positionsSmall[i * 3 + 1] += this.velocities[i * 3 + 1] * 0.5;
      this.positionsSmall[i * 3 + 2] += this.velocities[i * 3 + 2] * 0.5;

      if (this.positionsSmall[i * 3 + 1] > this.zone.y * 0.5) {
        this.positionsSmall[i * 3 + 0] = Math.random() * this.zone.x * 2 - 0.5 * this.zone.x * 2; // x
        this.positionsSmall[i * 3 + 1] = 0; // y
        this.positionsSmall[i * 3 + 2] = Math.random() * this.zone.z * 2 - 0.5 * this.zone.z * 2; // z
      }
    }

    this.particles.geometry.attributes.position.needsUpdate = true;
    this.particlesSmall.geometry.attributes.position.needsUpdate = true;
  }
}
