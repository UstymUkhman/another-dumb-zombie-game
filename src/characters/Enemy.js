import { MeshBasicMaterial } from '@three/materials/MeshBasicMaterial';
import { BoxGeometry } from '@three/geometries/BoxGeometry';
import CapsuleGeometry from '@/utils/CapsuleGeometry';

import Character from '@/characters/Character';
import ZOMBIE from '@/assets/gltf/zombie.glb';
import { Vector3 } from '@three/math/Vector3';

import { LoopOnce } from '@three/constants';
import { Mesh } from '@three/objects/Mesh';
import config from '@/assets/enemy.json';

const colliderMaterial = new MeshBasicMaterial({
  transparent: true,
  color: 0xFF0000,
  visible: true,
  opacity: 0.5
});

export default class Enemy extends Character {
  constructor (onLoad) {
    super(ZOMBIE, config, enemy => {
      this.currentAnimation = this.animations.idle;

      this.animations.softAttack.clampWhenFinished = true;
      this.animations.hardAttack.clampWhenFinished = true;

      this.animations.headshot.clampWhenFinished = true;
      this.animations.scream.clampWhenFinished = true;
      this.animations.death.clampWhenFinished = true;

      this.animations.softAttack.setLoop(LoopOnce);
      this.animations.hardAttack.setLoop(LoopOnce);

      this.animations.headshot.setLoop(LoopOnce);
      this.animations.scream.setLoop(LoopOnce);
      this.animations.death.setLoop(LoopOnce);

      this.currentAnimation.play();
      this.character = enemy;
      this.colliders = [];

      this._addHeadCollider(enemy);
      this._addBodyCollider(enemy);
      this._addLegsCollider(enemy);

      onLoad(enemy);
    });

    this.playerPosition = new Vector3();
    this.visiblePlayer = false;
    this.nextToPlayer = false;
    this.attacking = false;
  }

  _addHeadCollider (character) {
    const head = character.getObjectById(10, true);

    const headCollider = new Mesh(
      new BoxGeometry(20, 25, 25),
      colliderMaterial.clone()
    );

    this.colliders.push(headCollider);
    headCollider.position.y += 5;
    head.add(headCollider);
  }

  _addBodyCollider (character) {
    const spine = character.getObjectById(6, true);

    const bodyCollider = new Mesh(
      CapsuleGeometry(20, 50),
      colliderMaterial.clone()
    );

    bodyCollider.rotation.x -= Math.PI / 2;
    bodyCollider.position.y += 12.5;
    bodyCollider.position.z += 2.5;

    this.colliders.push(bodyCollider);
    spine.add(bodyCollider);
  }

  _addLegsCollider (character) {
    const rightUpLeg = character.getObjectById(53, true);
    const leftUpLeg = character.getObjectById(49, true);
    const rightLeg = character.getObjectById(54, true);
    const leftLeg = character.getObjectById(50, true);

    const upperLeg = new Mesh(
      new BoxGeometry(15, 50, 15),
      colliderMaterial.clone()
    );

    const lowerLeg = new Mesh(
      new BoxGeometry(10, 50, 10),
      colliderMaterial.clone()
    );

    lowerLeg.position.y -= 27.5;
    upperLeg.position.y -= 20;

    const rightUpLegCollider = upperLeg.clone();
    const leftUpLegCollider = upperLeg.clone();
    const rightLegCollider = lowerLeg.clone();
    const leftLegCollider = lowerLeg.clone();

    this.colliders.push(rightUpLegCollider);
    this.colliders.push(leftUpLegCollider);
    this.colliders.push(rightLegCollider);
    this.colliders.push(leftLegCollider);

    rightUpLeg.add(rightUpLegCollider);
    leftUpLeg.add(leftUpLegCollider);
    rightLeg.add(rightLegCollider);
    leftLeg.add(leftLegCollider);
  }

  idle () {
    this.currentAnimation.crossFadeTo(this.animations.idle, 0.25, true);
    this.animations.idle.play();

    setTimeout(() => {
      this.moving = false;
      this.running = false;
      this.attacking = false;

      this.lastAnimation = 'idle';
      this.currentAnimation.stop();

      this.setDirection('Idle');
      this.currentAnimation = this.animations.idle;
    }, 250);
  }

  walk () {
    this.currentAnimation.crossFadeTo(this.animations.walk, 0.25, true);
    this.animations.walk.play();

    setTimeout(() => {
      this.moving = true;
      this.running = false;
      this.attacking = false;

      this.lastAnimation = 'walk';
      this.currentAnimation.stop();

      this.setDirection('Walking');
      this.currentAnimation = this.animations.walk;
    }, 250);
  }

  scream (run = true) {
    this.currentAnimation.crossFadeTo(this.animations.scream, 0.133, true);
    this.animations.scream.play();

    this.attacking = false;
    this.running = false;
    this.moving = false;

    setTimeout(() => {
      this.currentAnimation.stop();
      this.lastAnimation = 'scream';
      this.currentAnimation = this.animations.scream;
      if (run) setTimeout(() => { this.run(); }, 2500);
    }, 133);
  }

  run () {
    this.currentAnimation.crossFadeTo(this.animations.run, 0.1, true);
    this.animations.run.play();

    setTimeout(() => {
      this.moving = true;
      this.running = true;
      this.attacking = false;

      this.lastAnimation = 'run';
      this.currentAnimation.stop();

      this.setDirection('Running');
      this.currentAnimation = this.animations.run;
    }, 100);
  }

  attack (hard = false) {
    const attack = hard ? 'hardAttack' : 'softAttack';
    const lastAnimation = this.lastAnimation;

    this.currentAnimation.crossFadeTo(this.animations[attack], 0.166, true);
    this.animations[attack].play();

    this.attacking = true;
    this.running = false;
    this.moving = false;

    setTimeout(() => {
      this.lastAnimation = attack;
      this.currentAnimation.stop();

      this.currentAnimation = this.animations[attack];
      setTimeout(() => { this[lastAnimation](); }, hard ? 4400 : 2500);
    }, 166);
  }

  update (delta) {
    super.update(delta);

    if (this.visiblePlayer) {
      this.character.lookAt(this.playerPosition);
    }
  }
};