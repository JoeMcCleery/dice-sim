import {
  Scene,
  ScenePerformancePriority,
  SceneOptimizer,
  Engine,
  Color4,
} from '@babylonjs/core';

export let scene: Scene;

export const createScene = async (engine: Engine) => {
  // Create new scene
  scene = new Scene(engine);

  // Scene optimisations
  scene.autoClearDepthAndStencil = false;
  scene.performancePriority = ScenePerformancePriority.BackwardCompatible;
  SceneOptimizer.OptimizeAsync(scene);

  // Set colours
  scene.clearColor = new Color4(15 / 255, 118 / 255, 110 / 255);

  // Wait untill scene is ready
  await scene.whenReadyAsync();
};
