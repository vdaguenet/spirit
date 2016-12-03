import shots from 'lib/shots';

export default class CameraDriver {
  constructor(camera) {
    this.camera = camera;
    this.order = [
      'back',
      'three-quarter-back',
      'right',
      'sanctuary'
    ];
    this.timeline = new TimelineMax({ paused: true });
    this.initTimeline();
  }

  initTimeline() {
    let start = 0;
    this.timeline.to(this.camera.position, 1.0, {
      x: shots[this.order[0]].position.x,
      y: shots[this.order[0]].position.y,
      z: shots[this.order[0]].position.z
    }, start);
    this.timeline.to(this.camera.rotation, 1.0, {
      x: shots[this.order[0]].rotation.x,
      y: shots[this.order[0]].rotation.y,
      z: shots[this.order[0]].rotation.z
    }, start);
    for (let i = 1; i < this.order.length; i++) {
      const prevShot = this.order[i - 1];
      const shot = this.order[i];
      start += shots[prevShot].duration;
      this.timeline.to(this.camera.position, 1.0, {
        x: shots[shot].position.x,
        y: shots[shot].position.y,
        z: shots[shot].position.z
      }, start);
      this.timeline.to(this.camera.rotation, 1.0, {
        x: shots[shot].rotation.x,
        y: shots[shot].rotation.y,
        z: shots[shot].rotation.z
      }, start);
    }
  }

  start() {
    this.timeline.play(0);
  }
}
