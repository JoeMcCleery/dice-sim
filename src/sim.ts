import { Project, Scene3D, PhysicsLoader, THREE } from "enable3d";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/** Get width of screen excluding scroll bars */
const getWidth = () => document.getElementsByTagName("html")[0].clientWidth;

class MainScene extends Scene3D {
  constructor() {
    super();
  }

  controls: OrbitControls;

  async init() {
    document.getElementById("loading")?.remove();
    document.getElementById("main")?.classList.remove("min-h-screen");

    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(getWidth(), window.innerHeight);
    window.addEventListener("resize", () => {
      this.camera.aspect = getWidth() / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(getWidth(), window.innerHeight);
    });
  }

  async preload() {
    // preload your assets here
  }

  async create() {
    // set up scene
    this.warpSpeed("-orbitControls");

    // Setup custom controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;

    // enable physics debug
    this.physics.debug?.enable();

    // pink box (with physics)
    const box = this.physics.add.box({ y: 5 }, { lambert: { color: "aqua" } });
    box.body.applyCentralImpulse(Math.random(), Math.random(), Math.random());
    box.body.applyTorqueImpulse(Math.random(), Math.random(), Math.random());
  }

  update() {}
}

// set your project configs
const config = { parent: "main", scenes: [MainScene] };

// load the ammo.js file from the /lib folder and start the project
PhysicsLoader("src/ammo", () => new Project(config));
