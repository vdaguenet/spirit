import './style/index.styl';

import loop from 'raf-loop';
import preloader from 'lib/Preloader';
import Mediator from 'lib/Mediator';
import settings from 'lib/settings';
import Webgl from './Webgl';
import { initGUI } from './gui';

const $intro = document.querySelector('.Intro');
const $introLine = document.querySelector('.Intro-line');
const $end = document.querySelector('.End');
const $audio = document.querySelector('audio');

let assetsLoaded = false;
let mustPlayTransitionOut = false;

const webgl = new Webgl(window.innerWidth, window.innerHeight);
document.body.appendChild(webgl.renderer.domElement);
const engine = loop(animate);
bindEvents();
start();

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
  tlIntro.add(onIntroEnd, 20);
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
  console.log(`Loading...${percent.toFixed(0)}%`);
}

function onLoaderComplete() {
  assetsLoaded = true;
  Mediator.on('run:end', onRunEnd);
  webgl.onLoaderComplete();
  if (settings.debug === true) { initGUI(webgl); }
  if (mustPlayTransitionOut) {
    onIntroEnd();
  }
}

function onIntroEnd() {
  if (!assetsLoaded) {
    mustPlayTransitionOut = true;
    return;
  }
  let tl = new TimelineMax();
  tl.to($intro, 1, { autoAlpha: 0, display: 'none', ease: Linear.easeNone }, 0);
  tl.add(() => {
    webgl.startRun();
  }, 0.3);
}

function onRunEnd() {
  TweenMax.to($end, 1.6, { autoAlpha: 1, display: 'flex', delay: 3.5 });
}

function onWindowBlur() {
  engine.stop();
  $audio.pause();
}

function onWindowFocus() {
  engine.start();
  $audio.play();
}
