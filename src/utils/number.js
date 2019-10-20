const smoothstep = (min, max, value) => Math.max(0, Math.min(1, (value - min) / (max - min)));
const mix = (value1, value2, percent) => value1 * (1 - percent) + value2 * percent;
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(value, max));

const map = (value, min, max) => clamp((value - min) / (max - min), 0, 1);
const random = (min, max) => Math.random() * (max - min) + min;
const lerp = (v0, v1, t) => v0 + t * (v1 - v0);

class Elastic {
  constructor (value) {
    this.target = value;
    this.value = value;
    this.speed = 3;
  }

  update (delta = 1 / 60) {
    const dist = this.target - this.value;
    this.value += dist * (this.speed * delta);
  }
}

export {
  smoothstep,
  Elastic,
  random,
  clamp,
  lerp,
  map,
  mix
};
