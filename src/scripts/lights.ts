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
    new Vector3(0, -1, -0.5),
    scene,
  );
  directionalLight.intensity = 0.5;
  directionalLight.autoUpdateExtends = true;
  directionalLight.autoCalcShadowZBounds = true;
  shadowGenerator = new ShadowGenerator(512, directionalLight);
  shadowGenerator.bias = 0;
  shadowGenerator.forceBackFacesOnly = true;
};

export const createHemisphericLight = () => {
  const hemisphericLight = new HemisphericLight(
    'hemispheric',
    Vector3.Up(),
    scene,
  );
  hemisphericLight.intensity = 0.2;
};

export const enableShadows = (mesh: AbstractMesh, enable: boolean) => {
  mesh.receiveShadows = enable;
  if (enable) {
    shadowGenerator.addShadowCaster(mesh);
  } else {
    shadowGenerator.removeShadowCaster(mesh);
  }
};
