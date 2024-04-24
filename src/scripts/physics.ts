import { Vector3, HavokPlugin, PhysicsEngineV2 } from '@babylonjs/core';
import HavokPhysics, { HavokPhysicsWithBindings } from '@babylonjs/havok';
import { scene } from './scene';

export let havokInstance: HavokPhysicsWithBindings;
export let havokPlugin: HavokPlugin;
export let physicsEngine: PhysicsEngineV2;

export const enablePhysics = async () => {
  // Enable havok physics
  havokInstance = await HavokPhysics();
  havokPlugin = new HavokPlugin(true, havokInstance);
  scene.enablePhysics(new Vector3(0, -80, 0), havokPlugin);
  physicsEngine = scene.getPhysicsEngine() as PhysicsEngineV2;
};
