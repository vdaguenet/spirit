import './style/index.styl';

import loop from 'raf-loop';
import preloader from 'lib/Preloader';
import Mediator from 'lib/Mediator';
import settings from 'lib/settings';
import Webgl from './Webgl';
import { initGUI } from './gui';

const $loader = document.querySelector('.Loading');
const $loadingValue = document.querySelector('.Loading-value');
const $intro = document.querySelector('.Intro');
const $introLine = document.querySelector('.Intro-line');

const webgl = new Webgl(window.innerWidth, window.innerHeight);
document.body.appendChild(webgl.renderer.domElement);
const engine = loop(animate);
bindEvents();

preloader.load([
  { id: 'heightmap', src: '../assets/textures/ground-9.jpg', priority: 0, origin: 'anonymous' }
]);
preloader.loadTextures([
  { id: 'sky', src: '../assets/sky-star2.jpg' },
  { id: 'snowflake', src: '../assets/textures/snowflake.png' }
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

  $loader.style.display = 'none';
  $intro.style.display = 'flex';

  const tlIntro = new TimelineMax();
  tlIntro.to($introLine, 1.5, { filter: 'blur(0px)', alpha: 1, ease: Linear.easeNone }, 0);
  tlIntro.to($introLine, 1.5, { filter: 'blur(15px)', alpha: 0, ease: Linear.easeNone }, 3);
  tlIntro.add(() => {
    $introLine.innerHTML = 'When cold is spreading…';
  }, 4.5);
  tlIntro.to($introLine, 1.5, { filter: 'blur(0px)', alpha: 1, ease: Linear.easeNone }, 4.6);
  tlIntro.to($introLine, 1.5, { filter: 'blur(15px)', alpha: 0, ease: Linear.easeNone }, 7.6);
  tlIntro.add(() => {
    $introLine.innerHTML = 'When snow starts falling…';
  }, 9.1);
  tlIntro.to($introLine, 1.5, { filter: 'blur(0px)', alpha: 1, ease: Linear.easeNone }, 9.2);
  tlIntro.to($introLine, 1.5, { filter: 'blur(15px)', alpha: 0, ease: Linear.easeNone }, 12.2);
  tlIntro.add(() => {
    $introLine.innerHTML = 'The Spirit of Christmas can fill the hearts…';
  }, 13.7);
  tlIntro.to($introLine, 1.5, { filter: 'blur(0px)', alpha: 1, ease: Linear.easeNone }, 13.8);
  tlIntro.to($introLine, 1.5, { filter: 'blur(15px)', alpha: 0, ease: Linear.easeNone }, 18.8);
  tlIntro.to($intro, 1, { autoAlpha: 0, display: 'none', ease: Linear.easeNone }, 20);
  tlIntro.add(onIntroEnd, 20.3);
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
  if (settings.debug === true) { initGUI(webgl); }
  start();
}

function onIntroEnd() {

  Mediator.emit('run:start');
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
