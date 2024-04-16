import {
  Color3,
  Mesh,
  PhysicsBody,
  PhysicsMaterial,
  PhysicsMotionType,
  PhysicsShapeConvexHull,
  SceneLoader,
  StandardMaterial,
  Vector3,
} from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import { DiceType } from 'types/dice';
import { enableShadows } from './lights';
import { scene } from './scene';
import diceModel from 'assets/dice.glb?url';
//import { physicsViewer } from './debug';

export let diceMeshes: { [type in DiceType]: Mesh };
export let diceShapes: { [type in DiceType]: PhysicsShapeConvexHull };
export let diceContainers: {
  [type in DiceType]: [Mesh, PhysicsBody][];
};

export const initDiceAsync = async () => {
  // Load meshes
  const dice = await SceneLoader.ImportMeshAsync('', diceModel);

  // Disable all template meshes (disable root node)
  dice.meshes.forEach(m => (m.isVisible = false));

  // Set mesh templates
  diceMeshes = {
    [DiceType.D4]: scene.getMeshByName('MODEL_D4') as Mesh,
    [DiceType.D6]: scene.getMeshByName('MODEL_D6') as Mesh,
    [DiceType.D8]: scene.getMeshByName('MODEL_D8') as Mesh,
    [DiceType.D10]: scene.getMeshByName('MODEL_D10') as Mesh,
    [DiceType.D12]: scene.getMeshByName('MODEL_D12') as Mesh,
    [DiceType.D20]: scene.getMeshByName('MODEL_D20') as Mesh,
  };

  // Create shapes
  diceShapes = {
    [DiceType.D4]: new PhysicsShapeConvexHull(
      scene.getMeshByName('SHAPE_D4') as Mesh,
      scene,
    ),
    [DiceType.D6]: new PhysicsShapeConvexHull(
      scene.getMeshByName('SHAPE_D6') as Mesh,
      scene,
    ),
    [DiceType.D8]: new PhysicsShapeConvexHull(
      scene.getMeshByName('SHAPE_D8') as Mesh,
      scene,
    ),
    [DiceType.D10]: new PhysicsShapeConvexHull(
      scene.getMeshByName('SHAPE_D10') as Mesh,
      scene,
    ),
    [DiceType.D12]: new PhysicsShapeConvexHull(
      scene.getMeshByName('SHAPE_D12') as Mesh,
      scene,
    ),
    [DiceType.D20]: new PhysicsShapeConvexHull(
      scene.getMeshByName('SHAPE_D20') as Mesh,
      scene,
    ),
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

  // Create dice material
  const material = new StandardMaterial('dice_mat', scene);
  material.diffuseColor = new Color3(15 / 255, 118 / 255, 110 / 255);

  // Create shape physics material
  const physicsMaterial: PhysicsMaterial = { restitution: 0.7, friction: 1 };

  for (const type of Object.values(DiceType)) {
    // Set dice material
    diceMeshes[type].material = material;

    // Set shape physics material
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
  container.length = 0;

  // No dice to throw
  if (count < 1) return;

  // Get the dice mesh template
  const meshTemplate = diceMeshes[type];

  // Create dice!
  const position = new Vector3(0, 8, 0);
  for (let i = 0; i < count; i++) {
    // Create new mesh from template
    const mesh = meshTemplate.clone(`${type}_${i}`);
    mesh.isVisible = true;
    // Enable shadows
    enableShadows(mesh, true);
    // Set random position and rotation
    mesh.position = position.add(Vector3.Random(-3, 3));
    mesh.rotation = Vector3.Random(-Math.PI, Math.PI);
    // Create body
    const body = new PhysicsBody(mesh, PhysicsMotionType.DYNAMIC, false, scene);
    body.shape = diceShapes[type];
    // Set random velocity
    body.setLinearVelocity(Vector3.Random(-20, 20));
    body.setAngularVelocity(Vector3.Random(-10, 10));
    // Add to container
    container.push([mesh, body]);

    // DEBUG
    // physicsViewer.showBody(body);
    // mesh.onDispose = () => {
    //   physicsViewer.hideBody(body);
    // };
  }
};
