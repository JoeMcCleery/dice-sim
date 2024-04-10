import {
  DirectionalLight,
  HemisphericLight,
  ShadowGenerator,
  Vector3,
} from '@babylonjs/core';
import { scene } from './scene';

export let shadowGenerator: ShadowGenerator;

export const createDirectionalLight = () => {
  const directionalLight = new DirectionalLight(
    'directional',
    new Vector3(0, -1, -0.5),
    scene,
  );
  directionalLight.intensity = 0.5;
  directionalLight.autoCalcShadowZBounds = true;
  shadowGenerator = new ShadowGenerator(512, directionalLight);
  shadowGenerator.bias = 0.01;
};

export const createHemisphericLight = () => {
  const hemisphericLight = new HemisphericLight(
    'hemispheric',
    Vector3.Up(),
    scene,
  );
  hemisphericLight.intensity = 0.2;
};
