import shots from 'lib/shots';

export default class CameraDriver {
  constructor(camera) {
    this.camera = camera;
    this.order = [
      'back',
      'right',
      'three-quarter-back',
      'back',
      'head' // always last
    ];

    this.camera.position.set(
      shots[this.order[0]].position.x,
      shots[this.order[0]].position.y,
      shots[this.order[0]].position.z
    );
    this.camera.rotation.set(
      shots[this.order[0]].rotation.x,
      shots[this.order[0]].rotation.y,
      shots[this.order[0]].rotation.z
    );

    this.timeline = new TimelineMax({ paused: true });
    this.initTimeline();
  }

  initTimeline() {
    let start = 0;
    for (let i = 1; i < this.order.length; i++) {
      const prevShot = this.order[i - 1];
      const shot = this.order[i];
      start += shots[prevShot].duration;

      this.timeline.to(this.camera.position, shots[shot].duration, {
        x: shots[shot].position.x,
        y: shots[shot].position.y,
        z: shots[shot].position.z,
        ease: Quad.easeInOut
      }, start);
      this.timeline.to(this.camera.rotation, shots[shot].duration, {
        x: shots[shot].rotation.x,
        y: shots[shot].rotation.y,
        z: shots[shot].rotation.z,
        ease: Quad.easeInOut
      }, start);
    }
  }

  start() {
    this.timeline.play(0);
  }
}
