import { createCamera } from 'scripts/camera';
import { createDirectionalLight, createHemisphericLight } from 'scripts/lights';
import { getDiceNumbers, initDiceAsync } from 'scripts/dice';
import { createEnvironment } from 'scripts/environment';
//import { createPhysicsViewer } from 'scripts/debug';
import SceneComponent from './SceneComponent';

function DiceSimulation() {
  async function onSceneReady() {
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
    // TODO get dice number results once simulation is stable
    // const numbers = getDiceNumbers();
  }

  return (
    <SceneComponent onSceneReady={onSceneReady} onPostRender={onPostRender} />
  );
}

export default DiceSimulation;
