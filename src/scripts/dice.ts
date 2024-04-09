import {
  Matrix,
  Mesh,
  MeshBuilder,
  PhysicsBody,
  PhysicsMotionType,
  PhysicsShapeConvexHull,
  Quaternion,
  Scene,
  ShadowGenerator,
  Vector3,
} from '@babylonjs/core';
import { DiceType } from 'types/dice';

export const createDice = (
  scene: Scene,
  type: DiceType,
  count: number,
  shadowGenerator: ShadowGenerator,
) => {
  if (count < 1) count = 1;

  // Create mesh based on dice type
  let mesh: Mesh;
  switch (type) {
    case DiceType.D4:
    case DiceType.D6:
    case DiceType.D8:
    case DiceType.D10:
    case DiceType.D12:
      // Create D8 mesh
      mesh = MeshBuilder.CreateBox(type, { depth: 1, height: 1, width: 1 });
      break;
    case DiceType.D20:
      // Create D20 mesh
      mesh = MeshBuilder.CreateIcoSphere(type, { subdivisions: 1 });
      break;
  }

  // Setup shadows
  mesh.receiveShadows = true;
  shadowGenerator.addShadowCaster(mesh);

  // Create physics shape
  const shape = new PhysicsShapeConvexHull(mesh, scene);
  shape.material = { restitution: 0.7 };

  // Create mesh instances with random rotations
  const scale = Vector3.One();
  const position = new Vector3(0, 5, 0);
  const matrix: Matrix[] = [];
  for (let i = 0; i < count; i++) {
    matrix.push(
      Matrix.Compose(
        scale,
        Quaternion.FromEulerVector(Vector3.Random(-Math.PI, Math.PI)),
        position.add(Vector3.Random(-2, 2)),
      ),
    );
  }
  mesh.thinInstanceAdd(matrix);

  // Create physics body
  const body = new PhysicsBody(mesh, PhysicsMotionType.DYNAMIC, false, scene);
  body.shape = shape;

  // Set random starting velocity
  for (let i = 0; i < body.numInstances; i++) {
    body.setLinearVelocity(Vector3.Random(-20, 20), i);
    body.setAngularVelocity(Vector3.Random(-10, 10), i);
  }

  return [mesh, body] as const;
};
