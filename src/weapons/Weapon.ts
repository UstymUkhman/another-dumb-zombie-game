type PerspectiveCamera = import('@three/cameras/PerspectiveCamera').PerspectiveCamera;
// type AudioListener = import('@three/audio/AudioListener').AudioListener;
type WeaponSettings = import('@/settings').Settings.Weapon;
// type Vector2 = import('@three/math/Vector2').Vector2;
type Vector3 = import('@three/math/Vector3').Vector3;
type Mesh = import('@three/objects/Mesh').Mesh;

// import { PositionalAudio } from '@three/audio/PositionalAudio';
import { Raycaster } from '@three/core/Raycaster';
import { Assets } from '@/managers/AssetsLoader';

export default class Weapon {
  private readonly loader = new Assets.Loader();
  private readonly raycaster = new Raycaster();

  private readonly camera: PerspectiveCamera;
  private readonly settings: WeaponSettings;

  // private readonly spread: Vector2;
  // private readonly recoil: Vector2;
  private enemies!: Array<Mesh>;
  private weapon?: Assets.GLTF;

  private readonly aimNear = 3.0;
  private readonly near = 4.5;
  private aiming = false;

  constructor (settings: WeaponSettings, camera: PerspectiveCamera) {
    // this.spread = settings.spread as Vector2;
    // this.recoil = settings.recoil as Vector2;

    this.raycaster.near = this.near;
    this.settings = settings;
    this.camera = camera;
    this.load();
  }

  private async load (): Promise<Assets.GLTF> {
    this.weapon = (await this.loader.loadGLTF(this.settings.model)).scene;

    this.weapon.rotation.setFromVector3(this.settings.rotation as Vector3);
    this.weapon.position.copy(this.settings.position as Vector3);
    this.weapon.scale.copy(this.settings.scale as Vector3);

    return this.weapon;
  }

  private async loadSounds (): Promise<Array<AudioBuffer>> {
    return await Promise.all(
      Object.values(this.settings.sounds)
        .map(this.loader.loadAudio.bind(this.loader))
    );
  }

  /* private addSounds (sounds: Array<AudioBuffer>): void {
    const listener = this.camera.children[0] as AudioListener;
    sounds.forEach(sound => {});
  } */

  public get model (): Assets.GLTF | undefined {
    return this.weapon;
  }

  public set targets (colliders: Array<Mesh>) {
    this.enemies = colliders;
  }

  protected set aim (aiming: boolean) {
    this.raycaster.near = aiming ? this.aimNear : this.near;
    this.aiming = aiming;
  }

  protected get aim (): boolean {
    return this.aiming;
  }

  public get damage (): number {
    return this.settings.damage;
  }
}