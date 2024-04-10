import {
  Mesh,
  MeshBuilder,
  PhysicsBody,
  PhysicsMotionType,
  PhysicsShapeConvexHull,
  Vector3,
} from '@babylonjs/core';
import { DiceType } from 'types/dice';
import { enableShadows } from './lights';
import { scene } from './scene';
import { physicsViewer } from './debug';

export let diceMeshes: { [type in DiceType]: Mesh };
export let diceShapes: { [type in DiceType]: PhysicsShapeConvexHull };
export let diceContainers: { [type in DiceType]: [Mesh, PhysicsBody][] };

export const initDiceAsync = async () => {
  // Import/create meshes
  diceMeshes = {
    [DiceType.D4]: MeshBuilder.CreateBox(DiceType.D4),
    [DiceType.D6]: MeshBuilder.CreateBox(DiceType.D6),
    [DiceType.D8]: MeshBuilder.CreateBox(DiceType.D8),
    [DiceType.D10]: MeshBuilder.CreateBox(DiceType.D10),
    [DiceType.D12]: MeshBuilder.CreateBox(DiceType.D12),
    [DiceType.D20]: MeshBuilder.CreateIcoSphere(DiceType.D20, {
      subdivisions: 1,
    }),
  };

  // Create shapes
  diceShapes = {
    [DiceType.D4]: new PhysicsShapeConvexHull(diceMeshes[DiceType.D4], scene),
    [DiceType.D6]: new PhysicsShapeConvexHull(diceMeshes[DiceType.D6], scene),
    [DiceType.D8]: new PhysicsShapeConvexHull(diceMeshes[DiceType.D8], scene),
    [DiceType.D10]: new PhysicsShapeConvexHull(diceMeshes[DiceType.D10], scene),
    [DiceType.D12]: new PhysicsShapeConvexHull(diceMeshes[DiceType.D12], scene),
    [DiceType.D20]: new PhysicsShapeConvexHull(diceMeshes[DiceType.D20], scene),
  };

  // Create dice containers
  diceContainers = {
    [DiceType.D4]: [],
    [DiceType.D6]: [],
    [DiceType.D8]: [],
    [DiceType.D10]: [],
    [DiceType.D12]: [],
    [DiceType.D20]: [],
  };

  // Create shape physics material
  const physicsMaterial = { restitution: 0.7 };

  for (const type of Object.values(DiceType)) {
    // Hide template mesh
    diceMeshes[type].isVisible = false;
    // Set shape material
    diceShapes[type].material = physicsMaterial;
  }
};

export const throwDice = (type: DiceType, count: number) => {
  // Remove previous dice
  const container = diceContainers[type];
  container.forEach(dice => {
    dice[0].dispose();
    dice[1].dispose();
  });

  // No dice to throw
  if (count < 1) return;

  // Get the dice mesh template
  const meshTemplate = diceMeshes[type];

  // Create dice!
  const position = new Vector3(0, 5, 0);
  for (let i = 0; i < count; i++) {
    // Create new mesh from template
    const mesh = meshTemplate.clone();
    mesh.isVisible = true;
    // Enable shadows
    enableShadows(mesh, true);
    // Set random position and rotation
    mesh.position = position.add(Vector3.Random(-1, 1));
    mesh.rotation = Vector3.Random(-Math.PI, Math.PI);
    // Create body
    const body = new PhysicsBody(mesh, PhysicsMotionType.DYNAMIC, false, scene);
    body.shape = diceShapes[type];
    // Set random velocity
    body.setLinearVelocity(Vector3.Random(-20, 20), i);
    body.setAngularVelocity(Vector3.Random(-10, 10), i);
    // Add to container
    container.push([mesh, body]);

    // DEBUG
    // physicsViewer.showBody(body);
    // mesh.onDispose = () => {
    //   physicsViewer.hideBody(body);
    // };
  }
};
