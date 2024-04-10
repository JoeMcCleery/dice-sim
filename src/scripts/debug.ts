import { PhysicsViewer } from '@babylonjs/core';
import { scene } from './scene';

export let physicsViewer: PhysicsViewer;

export const createPhysicsViewer = () => {
  physicsViewer = new PhysicsViewer();
  for (const mesh of scene.rootNodes) {
    if (mesh.physicsBody) {
      physicsViewer.showBody(mesh.physicsBody);
    }
  }
};
