import {
  MeshBuilder,
  PhysicsAggregate,
  PhysicsBody,
  PhysicsMotionType,
  PhysicsShapeBox,
  PhysicsShapeType,
  Quaternion,
  TransformNode,
  Vector3,
} from '@babylonjs/core';
import { scene } from './scene';

export const createEnvironment = () => {
  // Create ground
  const ground = MeshBuilder.CreateBox('ground', {
    width: 20,
    height: 5,
    depth: 20,
  });
  ground.position.y = -2.5;
  ground.receiveShadows = true;
  new PhysicsAggregate(
    ground,
    PhysicsShapeType.BOX,
    { mass: 0, friction: 0.5 },
    scene,
  );

  // Create walls
  const wallShape = new PhysicsShapeBox(
    Vector3.Up().scale(100),
    Quaternion.Identity(),
    new Vector3(5, 210, 30),
    scene,
  );
  wallShape.material = { restitution: 0.8, friction: 0 };
  // Left
  const wall_l = new TransformNode('wall_l');
  wall_l.position.x = -12.5;
  const wallBody_l = new PhysicsBody(
    wall_l,
    PhysicsMotionType.STATIC,
    false,
    scene,
  );
  wallBody_l.shape = wallShape;
  // Right
  const wall_r = new TransformNode('wall_r');
  wall_r.position.x = 12.5;
  const wallBody_r = new PhysicsBody(
    wall_r,
    PhysicsMotionType.STATIC,
    false,
    scene,
  );
  wallBody_r.shape = wallShape;
  // Back
  const wall_b = new TransformNode('wall_b');
  wall_b.position.z = 12.5;
  wall_b.rotation = new Vector3(0, Math.PI / 2, 0);
  const wallBody_b = new PhysicsBody(
    wall_b,
    PhysicsMotionType.STATIC,
    false,
    scene,
  );
  wallBody_b.shape = wallShape;
  // Front
  const wall_f = new TransformNode('wall_f');
  wall_f.position.z = -12.5;
  wall_f.rotation = new Vector3(0, Math.PI / 2, 0);
  const wallBody_f = new PhysicsBody(
    wall_f,
    PhysicsMotionType.STATIC,
    false,
    scene,
  );
  wallBody_f.shape = wallShape;
};
