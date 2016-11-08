import './style/index.styl';

import Webgl from './Webgl';
import Gui from 'guigui';
import loop from 'raf-loop';

const webgl = new Webgl(window.innerWidth, window.innerHeight);

const gui = new Gui();
gui.addFolder('PostProcessing')
  .add(webgl.params, 'usePostprocessing');

function resizeHandler() {
  webgl.resize(window.innerWidth, window.innerHeight);
}

function animate() {
  webgl.update();
  webgl.render();
}

document.body.appendChild(webgl.renderer.domElement);
window.addEventListener('resize', resizeHandler);
const engine = loop(animate);
engine.start();
