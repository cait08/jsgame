import { Subject } from "rxjs";
import { Geom } from "./geom";
import { Dice } from "./dice";
import { Drawing } from "./drawing";
import { Input } from "./input";
import { Physics } from "./physics";

import * as THREE from "three";
import { Light } from "./lights/light";

export class Game {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });

  drawing: Drawing;

  tick = new Subject<void>();

  geom = new Geom();

  nextGameTick = new Date().getTime();

  paused = false;

  frame = 0;

  input = new Input();

  constructor(params: { height: number; width: number }) {
    this.camera.position.z = 100;

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.append(this.renderer.domElement);

    const al = new THREE.AmbientLight(0xffffff, 10);

    this.scene.add(al);
    this.scene.fog = new THREE.Fog(0xcccccc, 1, 100);

    // Shapes below

    const ground = this.cube([100, 1, 100], {
      color: 0x222222,
      reflectivity: 0.5,
    });
    ground.position.y = -2;
    this.scene.add(ground);

    const cube = this.cube(undefined, {
      color: 0x0,
      roughness: 1,
      reflectivity: 1,
    });
    this.scene.add(cube);

    const cube2 = this.cube(undefined, {
      color: 0xddd,
      roughness: 1,
      reflectivity: 1,
    });
    this.scene.add(cube2);

    const dl = new THREE.DirectionalLight(0x0000ff, 1);
    dl.castShadow = true;
    dl.position.set(0, 100, 0);
    this.scene.add(dl);

    const red = this.spotlight([3, 3, 0], 0xff0000);
    const green = this.spotlight([0, 3, 0], 0x00ff00);
    const blue = this.spotlight([-3, 3, 0], 0x0000ff);

    (red as any).shadowCameraNear = 1;
    this.scene.add(...red, ...green, ...blue);

    cube.position.set(0, 0, 0);
    cube.castShadow = true;
    cube2.castShadow = true;
    ground.receiveShadow = true;

    // Rotate the cube

    const rotate = () => {
      setTimeout(() => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        cube2.rotation.x += +0.01;
        cube2.rotation.y += -0.011;
        rotate();
      });
    };

    rotate();

    this.camera.position.z = 5;

    this.animate();
    window.addEventListener("resize", () => this.onWindowResize());
  }

  spotlight(
    position: [number, number, number],
    color: THREE.ColorRepresentation = 0xff0000
  ) {
    const sl1 = new THREE.SpotLight(color, 1000, 8, Math.PI / 8, 0);
    sl1.castShadow = true;
    const slHelper = new THREE.SpotLightHelper(sl1);
    sl1.position.set(...position);
    return [sl1];
  }

  light() {
    const sphere = new THREE.SphereGeometry(0.01, 16, 8);
    const light1 = new THREE.PointLight(0xffffff, 100);
    light1.add(
      new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffffff }))
    );
    return light1;
  }

  cube(
    geom: [number, number, number] = [1, 1, 1],
    mat: THREE.MeshPhysicalMaterialParameters = {},
    position: [number, number, number] = [0, 0, 0]
  ) {
    const geometry = new THREE.BoxGeometry(...geom);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x0095dd,
      roughness: 0,
      ...mat,
    });
    const cube = new THREE.Mesh(geometry, material);

    return cube;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  think() {
    if (this.paused) {
      setTimeout(() => {
        this.think();
      }, 100);
    }

    setTimeout(() => {
      this.think();
    }, 24);
  }
}
