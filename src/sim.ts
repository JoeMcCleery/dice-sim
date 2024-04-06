import { Project, Scene3D, PhysicsLoader } from "enable3d";

const getWidth = () => document.getElementsByTagName("html")[0].clientWidth;

class MainScene extends Scene3D {
  constructor() {
    super();
  }

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

    // enable physics debug
    this.physics.debug?.enable();

    // pink box (with physics)
    this.physics.add.box({ y: 10 }, { lambert: { color: "aqua" } });
  }

  update() {}
}

// set your project configs
const config = { parent: "main", scenes: [MainScene] };

// load the ammo.js file from the /lib folder and start the project
PhysicsLoader("src/ammo", () => new Project(config));
