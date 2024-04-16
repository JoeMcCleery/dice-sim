import {
  Scene,
  ScenePerformancePriority,
  SceneOptimizer,
  HavokPlugin,
  Vector3,
  Engine,
  Color4,
} from '@babylonjs/core';
import HavokPhysics from '@babylonjs/havok';

export let scene: Scene;

export const createScene = async (engine: Engine) => {
  // Create new scene
  scene = new Scene(engine);

  // Scene optimisations
  scene.autoClearDepthAndStencil = false;
  scene.performancePriority = ScenePerformancePriority.BackwardCompatible;
  SceneOptimizer.OptimizeAsync(scene);

  // Enable havok physics
  const havokInstance = await HavokPhysics();
  const havokPlugin = new HavokPlugin(true, havokInstance);
  scene.enablePhysics(new Vector3(0, -80, 0), havokPlugin);

  // Set colours
  scene.clearColor = new Color4(15 / 255, 118 / 255, 110 / 255);

  // Wait untill scene is ready
  await scene.whenReadyAsync();
};
