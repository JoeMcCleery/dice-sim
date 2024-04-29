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
import { PhysicsMotionType, Vector3 } from '@babylonjs/core';
//import { PhysicsActivationControl } from '@babylonjs/core';

let timeout: number;

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

    // Check if any dice are still active
    const linearThreshold = 0.001;
    const angularThreshold = 0.001;
    const linear = Vector3.Zero();
    const angular = Vector3.Zero();
    const active = Object.values(DiceType).some(type => {
      return diceContainers[type].some(([, body]) => {
        // Check state
        const state = havokInstance.HP_Body_GetActivationState(
          body._pluginData.hpBodyId,
        )[1];
        const awake = state == havokPlugin._hknp.ActivationState.ACTIVE;
        if (!awake) return false;

        // Check velocity thresholds
        body.getLinearVelocityToRef(linear);
        body.getAngularVelocityToRef(angular);
        return (
          linear.x > linearThreshold ||
          linear.y > linearThreshold ||
          linear.z > linearThreshold ||
          angular.x > angularThreshold ||
          angular.y > angularThreshold ||
          angular.z > angularThreshold
        );
      });
    });

    // Still simulating
    if (active) {
      // Reset timeout
      if (timeout > -1) {
        clearTimeout(timeout);
        timeout = -1;
      }
      return;
    }

    // If timeout running do nothing
    if (timeout > -1) return;

    // Stop simulating after small delay
    timeout = setTimeout(() => {
      // Stop simulation
      setSimulating(false);
      // Set dice static
      Object.values(DiceType).forEach(type => {
        return diceContainers[type].forEach(([, body]) => {
          body.setMotionType(PhysicsMotionType.STATIC);
        });
      });
      // Calculate simulation result
      calculateResult();
    }, 300);
  }

  return (
    <SceneComponent onSceneReady={onSceneReady} onPostRender={onPostRender} />
  );
}

export default DiceSimulation;
