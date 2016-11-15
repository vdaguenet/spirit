'use strict';

var glslify = require('glslify');
var Pass = require('../../Pass');
var vertex = require('../../shaders/vertex/basic.glsl');
var fragment = require('./vignette-fs.glsl');

function VignettePass(options = {}) {
  Pass.call(this);

  this.setShader(vertex, fragment);

  this.params.boost = options.boost || 1;
  this.params.reduction = options.reduction || 1;
}

module.exports = VignettePass;

VignettePass.prototype = Object.create(Pass.prototype);
VignettePass.prototype.constructor = VignettePass;

VignettePass.prototype.run = function(composer) {
  this.shader.uniforms.boost.value = this.params.boost;
  this.shader.uniforms.reduction.value = this.params.reduction;
  composer.pass(this.shader);
};
