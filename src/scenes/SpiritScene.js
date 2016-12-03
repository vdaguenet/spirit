import { Scene, LinearFilter, RGBAFormat, WebGLRenderTarget } from 'three';
import WAGNER from 'lib/Wagner';
import Mediator from 'lib/Mediator';
import MultiPassBloomPass from 'lib/Wagner/src/passes/bloom/MultiPassBloomPass';
import Spirit from 'objects/Spirit';

export default class SpiritScene {
  constructor(width, height, renderer) {
    this.width = width;
    this.height = height;

    this.scene = new Scene();

    this.spirit = new Spirit();
    this.scene.add(this.spirit);

    Mediator.on('sanctuary:update', this.setPosition.bind(this));

    this.renderer = renderer;
    this.composer = new WAGNER.Composer(this.renderer);
    this.composer.setSize(width, height);

    this.renderTarget = new WebGLRenderTarget(width, height, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      stencilBuffer: true
    });

    this.bloomPass = new MultiPassBloomPass({
      blurAmount: 2,
      applyZoomBlur: true,
      zoomBlurStrength: 0.4
    });
  }

  resize(width, height) {
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  }

  setPosition(vec) {
    this.spirit.position.set(vec.x, vec.y, vec.z);
  }

  render(camera) {
    this.spirit.update();

    this.composer.reset();
    this.composer.renderer.clear();
    this.composer.render(this.scene, camera);
    this.composer.pass(this.bloomPass);
    this.composer.toTexture(this.renderTarget);
  }
}
