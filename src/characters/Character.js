import { MeshPhongMaterial } from '@three/materials/MeshPhongMaterial';
import { AnimationMixer } from '@three/animation/AnimationMixer';
import { gltfLoader } from '@/utils/assetsLoader';

import { camelCase } from '@/utils/string';
import { clamp } from '@/utils/number';
import to from 'await-to-js';

const BOUNDS = {
  front: Infinity,
  side: Infinity
};

export default class Character {
  constructor (asset, setting, onLoad = null) {
    this.speed = { x: 0, z: 0 };
    this.load(asset, onLoad);

    this.setting = setting;
    this.character = null;
    this.animations = {};

    this.running = false;
    this.moving = false;

    this.mixer = null;
    this.health = 100;
  }

  load (asset, callback) {
    return new Promise(async () => {
      let [error, gltf] = await to(gltfLoader(asset));

      if (!error) {
        gltf.scene.traverse(child => {
          if (child.isMesh) {
            child.castShadow = true;

            child.material = new MeshPhongMaterial({
              map: child.material.map,
              specular: 0x000000,
              skinning: true,
              shininess: 0
            });
          }
        });

        gltf.scene.position.set(...this.setting.position);
        gltf.scene.scale.set(...this.setting.scale);

        this.mixer = new AnimationMixer(gltf.scene);
        this.createAnimations(gltf.animations);

        callback(gltf.scene);
      }
    });
  }

  createAnimations (clips) {
    for (let c = 0; c < clips.length; c++) {
      const clip = camelCase(clips[c].name);
      this.animations[clip] = this.mixer.clipAction(clips[c]);
    }
  }

  setDirection (direction) {
    this.speed.x = this.setting.moves[direction][0];
    this.speed.z = this.setting.moves[direction][1];
  }

  updatePosition () {
    this.character.translateX(this.speed.x);
    this.character.translateZ(this.speed.z);

    this.character.position.z = clamp(
      this.character.position.z,
      -BOUNDS.front,
      BOUNDS.front
    );

    this.character.position.x = clamp(
      this.character.position.x,
      -BOUNDS.side,
      BOUNDS.side
    );
  }

  update (delta) {
    this.mixer.update(delta);

    if (this.moving) {
      this.updatePosition();
    }
  }

  static setBounds (stage) {
    BOUNDS.front = stage.front;
    BOUNDS.side = stage.side;
  }
};