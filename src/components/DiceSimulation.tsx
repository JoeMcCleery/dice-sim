import {
  DirectionalLight,
  MeshBuilder,
  PhysicsAggregate,
  PhysicsShapeType,
  Scene,
  ShadowGenerator,
  Vector3,
} from '@babylonjs/core';
import SceneComponent from './SceneComponent';
import { createCamera } from 'scripts/camera';

function DiceSimulation() {
  function onSceneReady(scene: Scene) {
    // Create camera
    createCamera(scene);

    // Create light
    const light = new DirectionalLight(
      'light',
      new Vector3(0, -1, -0.5),
      scene,
    );
    light.intensity = 0.9;
    light.position.y = 100;
    const shadowGenerator = new ShadowGenerator(1024, light);

    // Create environment
    const ground = MeshBuilder.CreateGround(
      'ground',
      { width: 20, height: 20 },
      scene,
    );
    ground.receiveShadows = true;
    new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);

    // Built-in 'sphere' shape.
    const box = MeshBuilder.CreateBox(
      'sphere',
      { width: 1, height: 1, depth: 1 },
      scene,
    );
    shadowGenerator.addShadowCaster(box);
    box.position.y = 5;
    box.rotation = new Vector3(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI,
    );
    const boxAggregate = new PhysicsAggregate(
      box,
      PhysicsShapeType.BOX,
      { mass: 1, restitution: 0.75 },
      scene,
    );
    boxAggregate.body.setLinearVelocity(
      new Vector3(
        (Math.random() * 2 - 1) * 5,
        (Math.random() * 2 - 1) * 5,
        (Math.random() * 2 - 1) * 5,
      ),
    );
    boxAggregate.body.setAngularVelocity(
      new Vector3(
        (Math.random() * 2 - 1) * 5,
        (Math.random() * 2 - 1) * 5,
        (Math.random() * 2 - 1) * 5,
      ),
    );
  }

  function onRender(scene: Scene) {}

  return <SceneComponent onSceneReady={onSceneReady} onRender={onRender} />;
}

export default DiceSimulation;
