import {
  ArcRotateCamera,
  ArcRotateCameraPointersInput,
  Vector3,
} from '@babylonjs/core';
import { scene } from './scene';

export let camera: ArcRotateCamera;

export const createCamera = () => {
  camera = new ArcRotateCamera('camera1', 0, 0, 0, Vector3.Zero(), scene);
  camera.panningSensibility = 0;
  camera.upperBetaLimit = Math.PI / 2;
  camera.setPosition(new Vector3(-20, 30, 0));
  camera.attachControl(scene.getEngine().getRenderingCanvas());
  camera.inputs.removeByType('ArcRotateCameraMouseWheelInput');
  const pointersInput = camera.inputs.attached[
    'pointers'
  ] as ArcRotateCameraPointersInput;
  pointersInput.multiTouchPanAndZoom = false;
  pointersInput.multiTouchPanning = false;
  pointersInput.pinchZoom = false;

  return camera;
};
