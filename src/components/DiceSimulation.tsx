import { createCamera } from 'scripts/camera';
import { createDirectionalLight, createHemisphericLight } from 'scripts/lights';
import {
  DiceType,
  diceContainers,
  calculateResult,
  initDiceAsync,
  setSimulating,
  simulating,
} from 'scripts/dice';
import { createEnvironment } from 'scripts/environment';
import SceneComponent from './SceneComponent';
import { enablePhysics, havokInstance, havokPlugin } from 'scripts/physics';
//import { PhysicsActivationControl } from '@babylonjs/core';

function DiceSimulation() {
  async function onSceneReady() {
    // Enable physics
    await enablePhysics();

    // Create camera
    createCamera();

    // Create light
    createDirectionalLight();
    createHemisphericLight();

    // Create environment
    createEnvironment();

    // Init dice
    await initDiceAsync();

    // DEBUG
    //createPhysicsViewer();
  }

  function onPostRender() {
    // Ignore if simulation stopped
    if (!simulating) return;

    // Check if any dice are still moving
    const active = Object.values(DiceType).some(type => {
      return diceContainers[type].some(([, body]) => {
        const state = havokInstance.HP_Body_GetActivationState(
          body._pluginData.hpBodyId,
        )[1];
        return state == havokPlugin._hknp.ActivationState.ACTIVE;
      });
    });
    if (active) return;

    // No longer simulating as all dice are inactive
    setSimulating(false);

    // Calculate simulation result
    calculateResult();
  }

  return (
    <SceneComponent onSceneReady={onSceneReady} onPostRender={onPostRender} />
  );
}

export default DiceSimulation;
