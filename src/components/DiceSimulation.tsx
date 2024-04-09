import { Mesh, PhysicsBody, Scene } from '@babylonjs/core';
import { DiceType } from 'types/dice';
import { createCamera } from 'scripts/camera';
import { createDirectionalLight, createHemisphericLight } from 'scripts/lights';
import { createDice } from 'scripts/dice';
import { createEnvironment } from 'scripts/environment';
import SceneComponent from './SceneComponent';
import { createPhysicsViewer } from 'scripts/debug';

function DiceSimulation() {
  const dice: (readonly [Mesh, PhysicsBody])[] = [];

  function onSceneReady(scene: Scene) {
    // Create camera
    createCamera(scene);

    // Create light
    const [light, shadowGenerator] = createDirectionalLight(scene);
    createHemisphericLight(scene);

    // Create environment
    createEnvironment(scene);

    // DEBUG
    dice.push(createDice(scene, DiceType.D8, 5, shadowGenerator));
    dice.push(createDice(scene, DiceType.D20, 5, shadowGenerator));

    // DEBUG
    //createPhysicsViewer(scene);
  }

  function onRender(scene: Scene) {
    dice.forEach(([mesh]) => mesh.thinInstanceRefreshBoundingInfo());
  }

  return <SceneComponent onSceneReady={onSceneReady} onRender={onRender} />;
}

export default DiceSimulation;
