import { DiceType } from 'types/dice';
import { createCamera } from 'scripts/camera';
import { createDirectionalLight, createHemisphericLight } from 'scripts/lights';
import {
  enableDiceShadows,
  diceMeshes,
  throwDice,
  initDiceAsync,
} from 'scripts/dice';
import { createEnvironment } from 'scripts/environment';
import { createPhysicsViewer } from 'scripts/debug';
import SceneComponent from './SceneComponent';

function DiceSimulation() {
  async function onSceneReady() {
    // Init dice
    await initDiceAsync();

    // Create camera
    createCamera();

    // Create light
    createDirectionalLight();
    createHemisphericLight();

    // Enable dice shadows
    enableDiceShadows();

    // Create environment
    createEnvironment();

    // DEBUG
    for (const type of Object.values(DiceType)) {
      throwDice(type, 1);
    }
    //createPhysicsViewer();
  }

  function onRender() {
    for (const mesh of Object.values(diceMeshes)) {
      mesh.thinInstanceRefreshBoundingInfo();
    }
  }

  return <SceneComponent onSceneReady={onSceneReady} onRender={onRender} />;
}

export default DiceSimulation;
