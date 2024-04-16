import {
  Color3,
  MeshBuilder,
  PhysicsAggregate,
  PhysicsBody,
  PhysicsMotionType,
  PhysicsShapeBox,
  PhysicsShapeType,
  Quaternion,
  StandardMaterial,
  TransformNode,
  Vector3,
} from '@babylonjs/core';
import { scene } from './scene';

const numSides = 6;
const radius = 10;
const groundHeight = 5;
const wallHeight = 300;
const wallThickness = 5;

export const createEnvironment = () => {
  // Create environment material
  const material = new StandardMaterial('env_mat', scene);
  material.diffuseColor = Color3.White();
  material.specularColor = Color3.Black();

  // Create ground
  const ground = MeshBuilder.CreateCylinder('ground', {
    height: groundHeight,
    diameter: radius * 2.0,
    tessellation: numSides,
  });
  ground.material = material;
  ground.position.y = -groundHeight / 2.0;
  ground.receiveShadows = true;
  new PhysicsAggregate(
    ground,
    PhysicsShapeType.CONVEX_HULL,
    { mass: 0, friction: 0.5 },
    scene,
  );

  // Create walls
  const wallShape = new PhysicsShapeBox(
    Vector3.Up().scale(wallHeight / 2.0 - groundHeight),
    Quaternion.Identity(),
    new Vector3(
      (Math.PI * radius * 2.0) / numSides + wallThickness,
      wallHeight,
      wallThickness,
    ),
    scene,
  );
  wallShape.material = { restitution: 0.8, friction: 0 };
  for (let i = 0; i < numSides; i++) {
    const wallSegment = new TransformNode(`wall_${i}`);
    const midPoint = getCirclePoint(i)
      .add(getCirclePoint(i + 1))
      .scale(0.5);
    const forward = midPoint.normalizeToNew();
    wallSegment.position = midPoint.add(forward.scale(wallThickness / 2.0));
    wallSegment.rotationQuaternion = Quaternion.FromLookDirectionLH(
      forward,
      Vector3.Up(),
    );
    const wallSegmentBody = new PhysicsBody(
      wallSegment,
      PhysicsMotionType.STATIC,
      false,
      scene,
    );
    wallSegmentBody.shape = wallShape;
  }
};

const getCirclePoint = (i: number) => {
  i %= numSides;
  return new Vector3(
    radius * Math.cos((Math.PI * 2.0 * i) / numSides),
    0,
    radius * Math.sin((Math.PI * 2.0 * i) / numSides),
  );
};
