import { MeshPhongMaterial } from '@three/materials/MeshPhongMaterial';
import { gltfLoader } from '@/utils/assetsLoader';
import { Raycaster } from '@three/core/Raycaster';

import { Vector2 } from '@three/math/Vector2';
import Events from '@/managers/Events';
import to from 'await-to-js';

const AIM_NEAR = 3;
const NEAR = 4.5;

export default class Character {
  constructor (asset, onLoad = null) {
    this._raycaster = new Raycaster();
    this.origin = new Vector2(0, 0);
    this._raycaster.near = NEAR;

    this.load(asset, onLoad);
    this._aiming = false;

    this.camera = null;
    this.targets = [];

    this.damage = 10;
    this.arm = null;
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
              specular: 0x2F2F2F
            });
          }
        });

        this.arm = gltf.scene;
        callback(gltf.scene);
      }
    });
  }

  shoot (collider) {
    const event = this._getEvent(collider);
    Events.dispatch(event);
  }

  // update (delta) { }

  _getEvent (collider) {
    if (!collider) return 'headshoot';
    else if (collider === 1) return 'bodyHit';

    return 'legHit';
  }

  get target () {
    this._raycaster.setFromCamera(this.origin, this.camera);
    const colliders = this._raycaster.intersectObjects(this.targets);
    return colliders.length ? this.targets.indexOf(colliders[0].object) : -1;
  }

  set aiming (now) {
    this._raycaster.near = now ? AIM_NEAR : NEAR;
    this._aiming = now;
  }

  get aiming () {
    this._aiming;
  }
};
