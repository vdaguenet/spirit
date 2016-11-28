import './style/index.styl';

import loop from 'raf-loop';
import preloader from 'lib/Preloader';
import Mediator from 'lib/Mediator';
import Webgl from './Webgl';
import { initGUI } from './gui';

const USE_GUI = true;

const $loader = document.querySelector('.Loading');
const $loadingValue = document.querySelector('.Loading-value');

const webgl = new Webgl(window.innerWidth, window.innerHeight);
document.body.appendChild(webgl.renderer.domElement);
const engine = loop(animate);
bindEvents();

preloader.load([
  { id: 'heightmap', src: '../assets/textures/ground-7.jpg', priority: 0, origin: 'anonymous' }
]);
preloader.loadTextures([
  { id: 'sky_back', src: '../assets/skybox/skybox_back.jpg' },
  { id: 'sky_bottom', src: '../assets/skybox/skybox_bottom.jpg' },
  { id: 'sky_front', src: '../assets/skybox/skybox_front.jpg' },
  { id: 'sky_left', src: '../assets/skybox/skybox_left.jpg' },
  { id: 'sky_right', src: '../assets/skybox/skybox_right.jpg' },
  { id: 'sky_top', src: '../assets/skybox/skybox_top.jpg' },
  { id: 'sky', src: '../assets/sky.jpg' }
]);

function resizeHandler() {
  webgl.resize(window.innerWidth, window.innerHeight);
}

function animate() {
  webgl.update();
  webgl.render();
}

function start() {
  engine.start();
  Mediator.emit('run:start'); // TODO: Do it when intro is finished
  $loader.style.display = 'none';
}

function bindEvents() {
  window.addEventListener('resize', resizeHandler);
  window.addEventListener('blur', onWindowBlur);
  window.addEventListener('focus', onWindowFocus);
  preloader.on('progress', onLoaderProgress);
  preloader.on('complete', onLoaderComplete);
}

function onLoaderProgress(e) {
  const percent = (e.completedCount / e.totalCount) * 100;
  $loadingValue.innerHTML = percent.toFixed(0);
}

function onLoaderComplete() {
  Mediator.on('run:start', onRunStart);
  Mediator.on('run:end', onRunEnd);
  webgl.onLoaderComplete();
  if (USE_GUI === true) { initGUI(webgl); }
  start();
}

function onRunStart() {
  webgl.startRun();
}

function onRunEnd() {
  // webgl.stopRun();
}

function onWindowBlur() {
  engine.stop();
}

function onWindowFocus() {
  engine.start();
}
