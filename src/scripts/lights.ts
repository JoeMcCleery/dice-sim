import {
  AbstractMesh,
  DirectionalLight,
  HemisphericLight,
  ShadowGenerator,
  Vector3,
} from '@babylonjs/core';
import { scene } from './scene';

export let directionalLight: DirectionalLight;
export let shadowGenerator: ShadowGenerator;

export const createDirectionalLight = () => {
  directionalLight = new DirectionalLight(
    'directional',
    new Vector3(0.3, -1, -0.15),
    scene,
  );
  directionalLight.intensity = 0.5;
  directionalLight.autoCalcShadowZBounds = true;
  shadowGenerator = new ShadowGenerator(512, directionalLight);
  shadowGenerator.bias = -0.0005;
  shadowGenerator.forceBackFacesOnly = true;
};

export const createHemisphericLight = () => {
  const hemisphericLight = new HemisphericLight(
    'hemispheric',
    Vector3.Up(),
    scene,
  );
  hemisphericLight.intensity = 0.5;
  //hemisphericLight.diffuse = new Color3(15 / 255, 118 / 255, 110 / 255);
};

export const enableShadows = (mesh: AbstractMesh, enable: boolean) => {
  mesh.receiveShadows = enable;
  if (enable) {
    shadowGenerator.addShadowCaster(mesh);
  } else {
    shadowGenerator.removeShadowCaster(mesh);
  }
};
