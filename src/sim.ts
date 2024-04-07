import {
  Project,
  Scene3D,
  PhysicsLoader,
  THREE,
  ExtendedObject3D,
} from "enable3d";
import { isMoving, random, debounce, getDimensions } from "./helpers.ts";
import { AmmoPhysics } from "three/examples/jsm/Addons.js";

const restitution = 0.6;
const friction = 1;
const wallRestitution = 1;
const wallFriction = 0;

class MainScene extends Scene3D {
  allDice: ExtendedObject3D[] = [];
  waitingForResult = true;

  async init() {
    this.allDice = [];

    // remove loading text.
    document.getElementById("loading")?.remove();

    // init renderer
    this.renderer.setPixelRatio(devicePixelRatio);
    let size = getDimensions("main");
    this.renderer.setSize(size.x, size.y);

    // update dimentions when window resized
    window.addEventListener(
      "resize",
      debounce(() => {
        let size = getDimensions("main");
        this.camera.aspect = size.x / size.y;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(size.x, size.y);
      }, 50),
    );
  }

  async preload() {
    // preload your assets here
  }

  async create() {
    // set up...
    const setup = await this.warpSpeed();

    // set up camera
    setup.camera?.position.set(0, 20, 30);
    setup.camera?.lookAt(0, 0, 0);

    //this.physics.debug?.enable();

    // set up custom controls
    setup.orbitControls!.enablePan = false;
    setup.orbitControls!.enableZoom = false;
    setup.orbitControls!.maxPolarAngle = Math.PI / 2.1;

    // set up environment
    setup.ground!.castShadow = false;
    setup.ground?.body.setRestitution(restitution);
    setup.ground?.body.setFriction(friction);
    const wallBack = this.physics.collisionShapeToRigidBody(
      new Ammo.btBoxShape(new Ammo.btVector3(23 / 2, 500, 0.5)),
      new Ammo.btTransform(
        new Ammo.btQuaternion(0, 0, 0, 1),
        new Ammo.btVector3(0, 500 - 1, -22 / 2),
      ),
      0,
      false,
    );
    wallBack.setCollisionFlags(0);
    wallBack.setRestitution(wallRestitution);
    wallBack.setFriction(wallFriction);
    this.physics.physicsWorld.addRigidBody(wallBack);
    const wallFront = this.physics.collisionShapeToRigidBody(
      new Ammo.btBoxShape(new Ammo.btVector3(23 / 2, 500, 0.5)),
      new Ammo.btTransform(
        new Ammo.btQuaternion(0, 0, 0, 1),
        new Ammo.btVector3(0, 500 - 1, 22 / 2),
      ),
      0,
      false,
    );
    wallFront.setCollisionFlags(0);
    wallFront.setRestitution(wallRestitution);
    wallFront.setFriction(wallFriction);
    this.physics.physicsWorld.addRigidBody(wallFront);
    const wallRight = this.physics.collisionShapeToRigidBody(
      new Ammo.btBoxShape(new Ammo.btVector3(0.5, 500, 21 / 2)),
      new Ammo.btTransform(
        new Ammo.btQuaternion(0, 0, 0, 1),
        new Ammo.btVector3(22 / 2, 500 - 1, 0),
      ),
      0,
      false,
    );
    wallRight.setCollisionFlags(0);
    wallRight.setRestitution(wallRestitution);
    wallRight.setFriction(wallFriction);
    this.physics.physicsWorld.addRigidBody(wallRight);
    const wallLeft = this.physics.collisionShapeToRigidBody(
      new Ammo.btBoxShape(new Ammo.btVector3(0.5, 500, 21 / 2)),
      new Ammo.btTransform(
        new Ammo.btQuaternion(0, 0, 0, 1),
        new Ammo.btVector3(-22 / 2, 500 - 1, 0),
      ),
      0,
      false,
    );
    wallLeft.setCollisionFlags(0);
    wallLeft.setRestitution(wallRestitution);
    wallLeft.setFriction(wallFriction);
    this.physics.physicsWorld.addRigidBody(wallLeft);

    // set up gravity
    this.physics.setGravity(0, -20, 0);

    this.resetDice();
  }

  destroyDice(dice: ExtendedObject3D) {
    this.allDice = this.allDice.filter((d) => d !== dice);
    this.destroy(dice);
  }

  destroyAllDice() {
    for (let i = this.allDice.length - 1; i >= 0; i--) {
      this.destroyDice(this.allDice[i]);
    }
  }

  resetDice() {
    this.destroyAllDice();
    for (let i = 0; i < 5; i++) {
      setTimeout(() => this.spawnDice(), i * 100);
    }
    this.waitingForResult = true;
  }

  spawnDice() {
    const dice = this.add.box(
      { y: 5 },
      {
        phong: {
          color: "aqua",
          specular: "#808080",
        },
      },
    );
    dice.rotation.set(random(Math.PI), random(Math.PI), random(Math.PI));
    this.physics.add.existing(dice);
    dice.body.setRestitution(restitution);
    dice.body.setFriction(friction);
    dice.body.applyCentralImpulse(random(30), random(5) - 5, random(30));
    dice.body.applyTorqueImpulse(random(), random(), random());

    this.allDice.push(dice);

    return dice;
  }

  update() {
    if (this.waitingForResult && !this.allDice.some(isMoving)) {
      console.log("Result!");
      this.waitingForResult = false;
      this.resetDice();
    }
  }
}

// set project configs
const config = {
  parent: "main",
  scenes: [MainScene],
  fixedTimestep: 1 / 30.0,
};

// load the ammo.js file from the /src/ammo folder and start the project
PhysicsLoader("/src/ammo", () => new Project(config));
