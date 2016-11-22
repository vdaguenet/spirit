import preloader from 'brindille-preloader';
import bindAll from 'lodash.bindall';
import { TextureLoader } from 'three';
import Emitter from 'component-emitter';

class Preloader extends Emitter {
  constructor() {
    super();
    bindAll(this, 'onManifestLoaded', 'onProgress', 'onError');

    this.manifest = undefined;
    this.textures = undefined;

    this.manifestLoaded = false;
    this.texturesLoaded = false;

    this.objectsToLoad = 0;
    this.objectsLoaded = 0;

    preloader.on('progress', this.onProgress);
    preloader.on('complete', this.onManifestLoaded);
    preloader.on('error', this.onError);
  }

  load(manifest) {
    this.manifest = [];
    this.manifest = manifest;
    this.objectsToLoad += manifest.length;
    preloader.load(manifest);
  }

  loadTextures(textures) {
    const loader = new TextureLoader();
    const textureCount = textures.length;
    let textureLoaded = 0;
    this.objectsToLoad += textureCount;
    this.textures = {};

    textures.forEach((tex) => {
      loader.load(tex.src, (texture) => {
        textureLoaded++;
        this.textures[tex.id] = texture;
        this.onProgress();

        if (textureLoaded >= textures.length) {
          this.onTexturesLoaded();
        }

      });
    });
  }

  getImage(id) {
    return preloader.getImage(id);
  }

  getTexture(id) {
    return this.textures[id];
  }

  onManifestLoaded() {
    this.manifestLoaded = true;
    this.onComplete();
  }

  onTexturesLoaded() {
    this.texturesLoaded = true;
    this.onComplete();
  }

  onComplete() {
    if (this.manifest === undefined) {
      this.manifestLoaded = true;
    }

    if (this.textures === undefined) {
      this.texturesLoaded = true;
    }

    if (this.texturesLoaded && this.manifestLoaded) {
      this.emit('complete');
    }
  }

  onProgress() {
    this.objectsLoaded++;
    this.emit('progress', {
      completedCount: this.objectsLoaded,
      totalCount: this.objectsToLoad
    });
  }

  onError(e) {
    this.emit('error', e);
  }
}

export default new Preloader();
