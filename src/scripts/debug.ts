import { PhysicsViewer, Scene } from '@babylonjs/core';

export const createPhysicsViewer = (scene: Scene) => {
  const physicsViewer = new PhysicsViewer();
  for (const mesh of scene.rootNodes) {
    if (mesh.physicsBody) {
      physicsViewer.showBody(mesh.physicsBody);
    }
  }

  return physicsViewer;
};
