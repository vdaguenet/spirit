import './style/index.styl';

import Webgl from './Webgl';
import Gui from 'guigui';
import loop from 'raf-loop';

const webgl = new Webgl(window.innerWidth, window.innerHeight);

const gui = new Gui();
const guiPost = gui.addFolder('PostProcessing');
guiPost.add(webgl.params, 'usePostprocessing');
const guiHemiLight = gui.addFolder('HemisphereLight');
guiHemiLight.addColorPicker(webgl.lights.hemisphere, 'color').on('update', (value) => {
  webgl.hemiLight.color.set(value);
});
guiHemiLight.addColorPicker(webgl.lights.hemisphere, 'groundColor').on('update', (value) => {
  webgl.hemiLight.groundColor.set(value);
});
const guiElk = gui.addFolder('Elk');
guiElk.addColorPicker(webgl.elk, 'color').on('update', (value) => {
  webgl.elk.material.color.set(value);
});
guiElk.addColorPicker(webgl.elk, 'emissive').on('update', (value) => {
  webgl.elk.material.emissive.set(value);
});
guiElk.addColorPicker(webgl.elk, 'specular').on('update', (value) => {
  webgl.elk.material.specular.set(value);
});
const guiElkLight = gui.addFolder('ElkLight');
guiElkLight.add(webgl.elk.light, 'intensity');
guiElkLight.add(webgl.elk.light, 'distance');
guiElkLight.add(webgl.elk.light, 'decay');
guiElkLight.add(webgl.elk.light.position, 'x');
guiElkLight.add(webgl.elk.light.position, 'y', { min: -100, max: 100 });
guiElkLight.add(webgl.elk.light.position, 'z');
const guiGround = gui.addFolder('Ground');
guiGround.addColorPicker(webgl.ground, 'color').on('update', (value) => {
  webgl.ground.mat.color.set(value);
});
guiGround.addColorPicker(webgl.ground, 'specular').on('update', (value) => {
  webgl.ground.mat.specular.set(value);
});

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
