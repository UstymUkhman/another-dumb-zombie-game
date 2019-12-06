import { MeshPhongMaterial } from '@three/materials/MeshPhongMaterial';
import { PerspectiveCamera } from '@three/cameras/PerspectiveCamera';
import { DirectionalLight } from '@three/lights/DirectionalLight';
import { WebGLRenderer } from '@three/renderers/WebGLRenderer';

import { BoxGeometry } from '@three/geometries/BoxGeometry';
import { AmbientLight } from '@three/lights/AmbientLight';
import { GridHelper } from '@three/helpers/GridHelper';
import { ReinhardToneMapping } from '@three/constants';

import { Scene } from '@three/scenes/Scene';
import { Mesh } from '@three/objects/Mesh';
import { Color } from '@three/math/Color';
import { Fog } from '@three/scenes/Fog';

const GROUND = 0x888888;
const WHITE = 0xFFFFFF;
const FOG = 0xA0A0A0;

export default class Playground {
  constructor () {
    this.setSize();

    this.createScene();
    this.createCamera();
    this.createLights();
    this.createGround();

    this.createRenderer();
    this.createEvents();
    // this.createControls();
  }

  setSize () {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.ratio = this.width / this.height;
  }

  createScene () {
    this.scene = new Scene();
    this.scene.background = new Color(FOG);
    this.scene.fog = new Fog(FOG, 1, 33);
  }

  createCamera () {
    this.camera = new PerspectiveCamera(45, this.ratio, 0.1, 1000);
    this.camera.rotation.set(0, Math.PI, 0);
    this.camera.position.set(-1.5, 3, -3.5);
    this.camera.setFocalLength(25.0);

    // this.camera.position.set(0, 3.5, -5);
    // this.camera.lookAt(0, 0, 0);
  }

  createLights () {
    const directional = new DirectionalLight(WHITE, 0.8);
    const ambient = new AmbientLight(WHITE);

    directional.position.set(0, 10, -50);
    directional.castShadow = true;

    directional.shadow.mapSize.height = 8192;
    directional.shadow.mapSize.width = 8192;

    directional.shadow.mapSize.x = 8192;
    directional.shadow.mapSize.y = 8192;

    directional.shadow.camera.bottom = -50;
    directional.shadow.camera.right = 50;
    directional.shadow.camera.left = -50;
    directional.shadow.camera.top = 50;

    directional.shadow.camera.far = 100;
    directional.shadow.camera.near = 1;

    this.scene.add(directional);
    this.scene.add(ambient);
  }

  createGround () {
    const ground = new Mesh(
      new BoxGeometry(100, 100, 1),
      new MeshPhongMaterial({
        depthWrite: false,
        color: GROUND
      })
    );

    ground.rotateX(-Math.PI / 2);
    ground.receiveShadow = true;
    ground.position.y = -0.5;
    this.scene.add(ground);
  }

  createGrid () {
    const grid = new GridHelper(100, 50, 0, 0);
    grid.material.transparent = true;
    grid.material.opacity = 0.25;
    grid.position.y = 0.0;
    this.scene.add(grid);
  }

  createRenderer () {
    this.renderer = new WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);

    this.renderer.toneMapping = ReinhardToneMapping;
    this.renderer.setSize(this.width, this.height);

    this.renderer.toneMappingExposure = 1.25;
    this.renderer.shadowMap.enabled = true;
    this.renderer.setClearColor(FOG, 1.0);

    this.element = this.renderer.domElement;
    document.body.appendChild(this.element);
  }

  createEvents () {
    this._onResize = this.onResize.bind(this);
    window.addEventListener('resize', this._onResize, false);
  }

  fadeIn () {
    this.element.style.opacity = 1;
    this.render();
  }

  render () {
    this.renderer.render(this.scene, this.camera);
  }

  onResize () {
    this.setSize();
    this.camera.aspect = this.ratio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  destroy () {
    window.removeEventListener('resize', this._onResize, false);
    document.body.removeChild(this.renderer.domElement);

    delete this.renderer;
    delete this.camera;
    delete this.scene;
  }

  static get bounds () {
    return {
      front: 49,
      side: 49
    };
  }
}
