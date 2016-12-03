import Gui from 'guigui';

let gui;

export function initGUI(webgl) {
  gui = new Gui();
  initGUICamera(webgl);
  // initGUILights(webgl);
  // initGUIFog(webgl);
  // initGUIGround(webgl);
  // initGUIMountain(webgl);
  // initGUIElk(webgl);
  // initGUIPostprocessing(webgl);
}

function initGUIPostprocessing(webgl) {
  const guiPost = gui.addFolder('PostProcessing');
  guiPost.add(webgl.params, 'usePostprocessing');
}

function initGUICamera(webgl) {
  const guiCamera = gui.addFolder('Camera');
  guiCamera.add(webgl.camera.position, 'x', { min: -90, max: 90 });
  guiCamera.add(webgl.camera.position, 'y', { min: -90, max: 90 });
  guiCamera.add(webgl.camera.position, 'z', { min: -3000, max: 3000 });
  guiCamera.add(webgl.camera.rotation, 'x', { min: -Math.PI, max: Math.PI, step: 0.1 });
  guiCamera.add(webgl.camera.rotation, 'y', { min: -Math.PI, max: Math.PI, step: 0.1 });
  guiCamera.add(webgl.camera.rotation, 'z', { min: -Math.PI, max: Math.PI, step: 0.1 });
}

function initGUILights(webgl) {
  const guiHemiLight = gui.addFolder('HemisphereLight');
  guiHemiLight.addColorPicker(webgl.lights.hemisphere, 'color').on('update', (value) => {
    webgl.hemiLight.color.set(value);
  });
  guiHemiLight.addColorPicker(webgl.lights.hemisphere, 'groundColor').on('update', (value) => {
    webgl.hemiLight.groundColor.set(value);
  });
  const guiDirLight = gui.addFolder('DirectionalLight');
  guiDirLight.add(webgl.directionalLigth.position, 'x', { min: -500, max: 500 });
  guiDirLight.add(webgl.directionalLigth.position, 'y', { min: -500, max: 500 });
  guiDirLight.add(webgl.directionalLigth.position, 'z', { min: -500, max: 500 });
  guiDirLight.add(webgl.directionalLigth, 'intensity', { min: 0, max: 1, step: 0.01 });
  guiDirLight.addColorPicker(webgl.lights.directional, 'color').on('update', (value) => {
    webgl.directionalLigth.color.set(value);
  });
}

function initGUIElk(webgl) {
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
}

function initGUIGround(webgl) {
  const guiGround = gui.addFolder('Ground');
  guiGround.addColorPicker(webgl.ground, 'color').on('update', (value) => {
    webgl.ground.mat.color.set(value);
  });
  guiGround.addColorPicker(webgl.ground, 'specular').on('update', (value) => {
    webgl.ground.mat.specular.set(value);
  });
}

function initGUIFog(webgl) {
  const guiFog = gui.addFolder('Fog');
  guiFog.addColorPicker(webgl.fog, 'color').on('update', (value) => {
    webgl.scene.fog.color.set(value);
  });
  guiFog.add(webgl.scene.fog, 'density', { min: 0, max: 0.01, step: 0.0001 });
}

function initGUIMountain(webgl) {
  const guiMountain = gui.addFolder('Mountain');
  guiMountain.addColorPicker(webgl.mountain, 'colorTop').on('update', (value) => {
    webgl.mountain.mat.uniforms.colorTop.value.set(value);
  });
  guiMountain.addColorPicker(webgl.mountain, 'colorBottom').on('update', (value) => {
    webgl.mountain.mat.uniforms.colorBottom.value.set(value);
  });
}
