import { Object3D, BufferAttribute, BufferGeometry, ShaderMaterial, Points, AdditiveBlending, Color } from 'three';
import preloader from 'lib/Preloader';
import settings from 'lib/settings';

export default class Snow extends Object3D {
  constructor() {
    super();

    this.velocity = {
      x: 2.5,
      y: 1.5
    };
    this.zone = {
      x: settings.world.width * 2,
      y: 600,
      z: settings.world.height * 0.5
    };
    this.particlesCount = 20000;
    this.positions = new Float32Array(this.particlesCount * 3);

    for(let i = 0, j = 0; i < this.particlesCount; i++, j += 3) {
      this.positions[j + 0] = Math.random() * this.zone.x - this.zone.x * 0.5;
      this.positions[j + 1] = Math.random() * this.zone.y - this.zone.y * 0.5;
      this.positions[j + 2] = Math.random() * this.zone.z - this.zone.z * 0.5;
    }

    this.geom = new BufferGeometry();
    this.geom.addAttribute('position', new BufferAttribute(this.positions, 3));
    this.geom.computeBoundingSphere();

    this.mat = new ShaderMaterial({
      vertexShader: require('shaders/snow.vert'),
      fragmentShader: require('shaders/snow.frag'),
      uniforms: {
        'texture': { type: 't', value: preloader.getTexture('snowflake') },
        'color': { type: 'c', value: new Color(0xFFFFFF) }
      },
      transparent: true,
      blending: AdditiveBlending
    });

    this.particles = new Points(this.geom, this.mat);
    this.add(this.particles);
  }

  update() {
    let positions = this.particles.geometry.attributes.position.array;
    for(let i = 0, j = 0; i < this.particlesCount; i++, j += 3) {
      positions[j + 0] -= this.velocity.x;
      positions[j + 1] -= this.velocity.y;
      if(positions[j + 1] < (-this.zone.y * 0.5)) {
        positions[j + 0] = Math.random() * this.zone.x * 0.5;
        positions[j + 1] = this.zone.y * 0.5;
      }
    }
    this.particles.geometry.attributes.position.needsUpdate = true;
  }
}
