import {
  ArcRotateCamera,
  ArcRotateCameraPointersInput,
  Scene,
  Vector3,
} from '@babylonjs/core';

export const createCamera = (scene: Scene) => {
  const camera = new ArcRotateCamera('camera1', 0, 0, 0, Vector3.Zero(), scene);
  camera.panningSensibility = 0;
  camera.upperBetaLimit = Math.PI / 2.1;
  camera.setPosition(new Vector3(0, 10, 20));
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
