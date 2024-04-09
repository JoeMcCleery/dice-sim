import {
  DirectionalLight,
  HemisphericLight,
  Scene,
  ShadowGenerator,
  Vector3,
} from '@babylonjs/core';

export const createDirectionalLight = (scene: Scene) => {
  const light = new DirectionalLight(
    'directional',
    new Vector3(0, -1, -0.5),
    scene,
  );
  light.intensity = 0.5;
  light.autoCalcShadowZBounds = true;
  const shadowGenerator = new ShadowGenerator(512, light);
  shadowGenerator.bias = 0.01;

  return [light, shadowGenerator] as const;
};

export const createHemisphericLight = (scene: Scene) => {
  const light = new HemisphericLight('hemispheric', Vector3.Up(), scene);
  light.intensity = 0.2;

  return light;
};
