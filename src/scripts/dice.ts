import {
  Matrix,
  Mesh,
  MeshBuilder,
  PhysicsBody,
  PhysicsMotionType,
  PhysicsShape,
  PhysicsShapeConvexHull,
  Quaternion,
  Vector3,
} from '@babylonjs/core';
import { DiceType } from 'types/dice';
import { shadowGenerator } from './lights';
import { scene } from './scene';

export let diceMeshes: { [type in DiceType]: Mesh };
export let diceShapes: { [type in DiceType]: PhysicsShape };
export let diceBodies: { [type in DiceType]: PhysicsBody | null };

export const initDiceAsync = async () => {
  // Import/create meshes
  diceMeshes = {
    [DiceType.D4]: MeshBuilder.CreateBox(DiceType.D8),
    [DiceType.D6]: MeshBuilder.CreateBox(DiceType.D8),
    [DiceType.D8]: MeshBuilder.CreateBox(DiceType.D8),
    [DiceType.D10]: MeshBuilder.CreateBox(DiceType.D8),
    [DiceType.D12]: MeshBuilder.CreateBox(DiceType.D8),
    [DiceType.D20]: MeshBuilder.CreateIcoSphere(DiceType.D8, {
      subdivisions: 1,
    }),
  };

  // Create dice shapes
  diceShapes = {
    [DiceType.D4]: new PhysicsShapeConvexHull(diceMeshes[DiceType.D4], scene),
    [DiceType.D6]: new PhysicsShapeConvexHull(diceMeshes[DiceType.D6], scene),
    [DiceType.D8]: new PhysicsShapeConvexHull(diceMeshes[DiceType.D8], scene),
    [DiceType.D10]: new PhysicsShapeConvexHull(diceMeshes[DiceType.D10], scene),
    [DiceType.D12]: new PhysicsShapeConvexHull(diceMeshes[DiceType.D12], scene),
    [DiceType.D20]: new PhysicsShapeConvexHull(diceMeshes[DiceType.D20], scene),
  };

  // Create dice bodies
  diceBodies = {
    [DiceType.D4]: null,
    [DiceType.D6]: null,
    [DiceType.D8]: null,
    [DiceType.D10]: null,
    [DiceType.D12]: null,
    [DiceType.D20]: null,
  };

  for (const type of Object.values(DiceType)) {
    // Set shape material
    diceShapes[type].material = { restitution: 0.7 };

    // Disable mesh by default
    diceMeshes[type].setEnabled(false);
  }
};

export const enableDiceShadows = () => {
  for (const mesh of Object.values(diceMeshes)) {
    mesh.receiveShadows = true;
    shadowGenerator.addShadowCaster(mesh);
  }
};

export const throwDice = (type: DiceType, count: number) => {
  // Get the dice mesh
  const mesh = diceMeshes[type];

  // Enable or disable if dice is used
  if (count < 1) {
    mesh.setEnabled(false);
    diceBodies[type]?.dispose();
    return;
  } else {
    mesh.setEnabled(true);
  }

  // Create mesh instances with random rotations
  const scale = Vector3.One();
  const position = new Vector3(0, 5, 0);
  const buffer: Float32Array = new Float32Array(16 * count);
  for (let i = 0; i < count; i++) {
    Matrix.Compose(
      scale,
      Quaternion.FromEulerVector(Vector3.Random(-Math.PI, Math.PI)),
      position.add(Vector3.Random(-2, 2)),
    ).copyToArray(buffer, 16 * i);
  }
  mesh.thinInstanceSetBuffer('matrix', buffer, 16, false);
  mesh.thinInstanceBufferUpdated('matrix');

  // Create/update dice body
  let body = diceBodies[type];
  if (body) {
    // Update existing body
    body.updateBodyInstances();
  } else {
    // Create new body
    body = new PhysicsBody(mesh, PhysicsMotionType.DYNAMIC, false, scene);
    diceBodies[type] = body;
  }
  body.shape = diceShapes[type];

  // Set random starting velocity
  for (let i = 0; i < body.numInstances; i++) {
    body.setLinearVelocity(Vector3.Random(-20, 20), i);
    body.setAngularVelocity(Vector3.Random(-10, 10), i);
  }
};
