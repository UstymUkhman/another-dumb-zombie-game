type AnimationAction = import('@three/animation/AnimationAction').AnimationAction;
type AudioListener = import('@three/audio/AudioListener').AudioListener;

type CharacterAnimations = import('@/settings').Settings.Animations;
type CharacterAnimation = import('@/settings').Settings.Animation;
type CharacterSettings = import('@/settings').Settings.Character;
// type CharacterSounds = import('@/settings').Settings.Sounds;

type Vector3 = import('@three/math/Vector3').Vector3;
type Actions = { [name: string]: AnimationAction };

import { MeshPhongMaterial } from '@three/materials/MeshPhongMaterial';
import { AnimationMixer } from '@three/animation/AnimationMixer';
import { PositionalAudio } from '@three/audio/PositionalAudio';

import CapsuleGeometry from '@/utils/CapsuleGeometry';
import { DynamicCollider } from '@/utils/Material';
import { Assets } from '@/managers/AssetsLoader';

import { camelCase } from '@/utils/String';
import { Mesh } from '@three/objects/Mesh';
import Physics from '@/managers/Physics';

export default class Character {
  private readonly loader = new Assets.Loader();
  private moves = { speed: 0, angle: 0 };
  protected animations: Actions = {};
  // private sounds: CharacterSounds;

  private mixer?: AnimationMixer;
  private model?: Assets.GLTF;
  protected object: Mesh;

  protected running = false;
  protected moving = false;
  protected dead = false;

  private still = false;
  private health = 100;

  public constructor (private settings: CharacterSettings) {
    this.object = new Mesh(
      new CapsuleGeometry(0.25, 1.2),
      DynamicCollider
    );
  }

  protected setCharacterMaterial (character: Assets.GLTF, opacity = 1): void {
    character.traverse(child => {
      const childMesh = child as Mesh;
      const material = childMesh.material as MeshPhongMaterial;

      if (childMesh.isMesh) {
        childMesh.castShadow = true;

        childMesh.material = new MeshPhongMaterial({
          map: material.map,
          specular: 0x000000,
          transparent: true,
          skinning: true,
          shininess: 0,
          opacity
        });
      }
    });
  }

  protected createAnimations (model: Assets.GLTFModel): void {
    const animations = model.animations as Assets.Animations;
    this.mixer = new AnimationMixer(model.scene);

    for (let a = 0; a < animations.length; a++) {
      const clip = camelCase(animations[a].name);
      this.animations[clip] = this.mixer.clipAction(animations[a]);
    }
  }

  protected setAnimation (animation: CharacterAnimation): void {
    const animations = this.settings.animations as CharacterAnimations;

    this.moves.speed = animations[animation][0];
    this.moves.angle = animations[animation][1];
  }

  protected createAudio (sound: AudioBuffer, listener: AudioListener, volume = 10): PositionalAudio {
    const audio = new PositionalAudio(listener);

    audio.setVolume(volume);
    audio.setBuffer(sound);

    return audio;
  }

  protected update (delta: number): void {
    this.mixer?.update(delta);

    if (this.moving) {
      Physics.move(this.moves);
      this.still = false;
    }

    else if (!this.still) {
      this.still = true;
      Physics.stop();
    }
  }

  protected checkIfAlive (): void {
    if (this.dead) return;
    this.dead = this.dead || !this.health;
    // this.dead && this.death();
  }

  public async load (): Promise<Assets.GLTFModel> {
    const character = await this.loader.loadGLTF(this.settings.model);
    character.scene.position.set(0, -this.settings.collider, 0);

    this.object.position.copy(this.settings.position as Vector3);
    this.object.scale.copy(this.settings.scale as Vector3);

    this.setCharacterMaterial(character.scene);
    this.object.add(character.scene);

    if (character.animations) {
      this.createAnimations(character);
    }

    this.model = character.scene;
    return character;
  }

  public dispose (): void {
    const children = this.model?.children;

    // this.rightUpLeg.remove(this.colliders[2]);
    // this.leftUpLeg.remove(this.colliders[3]);
    // this.rightLeg.remove(this.colliders[4]);
    // this.leftLeg.remove(this.colliders[5]);
    // this.spine.remove(this.colliders[1]);
    // this.head.remove(this.colliders[0]);

    // for (let c = 0; c < this.colliders.length; c++) {
    //   this.colliders.splice(c, 1);
    // }

    for (let c = 0; children && c < children.length; c++) {
      this.model?.remove(children[c]);
    }

    for (const animation in this.animations) {
      this.animations[animation].stopFading();
      this.animations[animation].stop();
      delete this.animations[animation];
    }

    // delete this.colliders;
    // delete this.sounds;
    delete this.model;
  }

  public reset (): void {
    this.moves = { speed: 0, angle: 0 };
    this.running = false;
    this.moving = false;

    this.health = 100;
    this.dead = false;
  }

  public get collider (): Mesh {
    return this.object;
  }

  public get alive (): boolean {
    return !this.dead;
  }
}
