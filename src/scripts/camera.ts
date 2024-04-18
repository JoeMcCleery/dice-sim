import {
  ArcRotateCamera,
  //ArcRotateCameraPointersInput,
  Vector3,
} from '@babylonjs/core';
import { scene } from './scene';
import { envRadius } from './environment';

const defaultPosition = new Vector3(-15, 25, 0);

export let camera: ArcRotateCamera;

export const resetCamera = () => {
  camera.setPosition(defaultPosition);
  camera.setTarget(Vector3.Zero());
};

export const createCamera = () => {
  camera = new ArcRotateCamera('camera1', 0, 0, 0, Vector3.Zero(), scene);
  camera.upperBetaLimit = Math.PI / 2;
  camera.setPosition(defaultPosition);
  camera.attachControl(scene.getEngine().getRenderingCanvas());
  camera.panningDistanceLimit = envRadius;
  camera.lowerRadiusLimit = 2;
  camera.upperRadiusLimit = 100;
  camera.panningSensibility = 200;
  camera.wheelPrecision = 10;
  camera.useNaturalPinchZoom = true;
  //camera.inputs.removeByType('ArcRotateCameraMouseWheelInput');
  // const pointersInput = camera.inputs.attached[
  //   'pointers'
  // ] as ArcRotateCameraPointersInput;
  //pointersInput.multiTouchPanAndZoom = false;
  //pointersInput.multiTouchPanning = false;
  //pointersInput.pinchZoom = false;

  let prevRadius = camera.radius;
  scene.beforeRender = () => {
    let ratio = 1;
    if (prevRadius != camera.radius) {
      ratio = prevRadius / camera.radius;
      prevRadius = camera.radius;

      camera.panningSensibility *= ratio;
      camera.wheelPrecision *= ratio;
    }
  };

  return camera;
};
