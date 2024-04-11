import { PhysicsViewer, Mesh } from '@babylonjs/core';
import { scene } from './scene';

export let physicsViewer: PhysicsViewer;

export const createPhysicsViewer = () => {
  physicsViewer = new PhysicsViewer();
  for (const node of scene.rootNodes) {
    const mesh = node as Mesh;
    if (mesh && mesh!.physicsBody) {
      physicsViewer.showBody(mesh.physicsBody);
    }
  }
};
