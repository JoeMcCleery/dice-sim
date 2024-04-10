import { PhysicsViewer } from '@babylonjs/core';
import { scene } from './scene';

export const createPhysicsViewer = () => {
  const physicsViewer = new PhysicsViewer();
  for (const mesh of scene.rootNodes) {
    if (mesh.physicsBody) {
      physicsViewer.showBody(mesh.physicsBody);
    }
  }

  return physicsViewer;
};
