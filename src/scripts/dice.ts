import {
  Color3,
  HavokPlugin,
  Mesh,
  PhysicsBody,
  PhysicsEngineV2,
  PhysicsMaterial,
  PhysicsMotionType,
  PhysicsShapeConvexHull,
  RegisterMaterialPlugin,
  SceneLoader,
  StandardMaterial,
  Texture,
  Vector3,
} from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import { enableShadows } from './lights';
import { scene } from './scene';
import diceModel from 'assets/dice.glb?url';
import fontAtlas from 'assets/font-atlas.png?url';
import d4fontAtlas from 'assets/d4-font-atlas.png?url';
import DicePluginMaterial from 'scripts/dicePluginMaterial';
//import { physicsViewer } from './debug';

export enum DiceType {
  D4 = 'D4',
  D6 = 'D6',
  D8 = 'D8',
  D10 = 'D10',
  D12 = 'D12',
  D20 = 'D20',
}

interface StandardDiceMaterial extends StandardMaterial {
  dice: DicePluginMaterial;
}

export let diceMeshes: { [type in DiceType]: Mesh };
export let diceShapeMeshes: { [type in DiceType]: Mesh };
export let diceShapeNormals: { [type in DiceType]: Vector3[] };
export let diceShapes: { [type in DiceType]: PhysicsShapeConvexHull };
export let diceContainers: {
  [type in DiceType]: [Mesh, PhysicsBody][];
};

const normalIndexToNumber = {
  [DiceType.D4]: [2, 4, 3, 1],
  [DiceType.D6]: [1, 5, 4, 3, 2, 6],
  [DiceType.D8]: [6, 2, 8, 4, 7, 3, 5, 1],
  [DiceType.D10]: [4, 6, 8, 10, 2, 9, 1, 3, 5, 7],
  [DiceType.D12]: [5, 6, 1, 12, 10, 2, 3, 9, 8, 4, 11, 7],
  [DiceType.D20]: [
    13, 15, 3, 9, 12, 18, 6, 8, 7, 2, 19, 14, 17, 5, 16, 4, 20, 11, 10, 1,
  ],
};

export const initDiceAsync = async () => {
  // Load meshes
  const dice = await SceneLoader.ImportMeshAsync('', diceModel);

  // Disable all template meshes and remove parents
  dice.meshes.forEach(m => {
    m.setParent(null);
    m.setEnabled(false);
  });

  // Set mesh templates
  diceMeshes = {
    [DiceType.D4]: scene.getMeshByName('MODEL_D4') as Mesh,
    [DiceType.D6]: scene.getMeshByName('MODEL_D6') as Mesh,
    [DiceType.D8]: scene.getMeshByName('MODEL_D8') as Mesh,
    [DiceType.D10]: scene.getMeshByName('MODEL_D10') as Mesh,
    [DiceType.D12]: scene.getMeshByName('MODEL_D12') as Mesh,
    [DiceType.D20]: scene.getMeshByName('MODEL_D20') as Mesh,
  };

  // Create dice shape meshes
  diceShapeMeshes = {
    [DiceType.D4]: scene.getMeshByName('SHAPE_D4') as Mesh,
    [DiceType.D6]: scene.getMeshByName('SHAPE_D6') as Mesh,
    [DiceType.D8]: scene.getMeshByName('SHAPE_D8') as Mesh,
    [DiceType.D10]: scene.getMeshByName('SHAPE_D10') as Mesh,
    [DiceType.D12]: scene.getMeshByName('SHAPE_D12') as Mesh,
    [DiceType.D20]: scene.getMeshByName('SHAPE_D20') as Mesh,
  };

  // Create dice shape normals
  diceShapeNormals = {
    [DiceType.D4]: [],
    [DiceType.D6]: [],
    [DiceType.D8]: [],
    [DiceType.D10]: [],
    [DiceType.D12]: [],
    [DiceType.D20]: [],
  };

  // Create shapes
  diceShapes = {
    [DiceType.D4]: new PhysicsShapeConvexHull(
      diceShapeMeshes[DiceType.D4],
      scene,
    ),
    [DiceType.D6]: new PhysicsShapeConvexHull(
      diceShapeMeshes[DiceType.D6],
      scene,
    ),
    [DiceType.D8]: new PhysicsShapeConvexHull(
      diceShapeMeshes[DiceType.D8],
      scene,
    ),
    [DiceType.D10]: new PhysicsShapeConvexHull(
      diceShapeMeshes[DiceType.D10],
      scene,
    ),
    [DiceType.D12]: new PhysicsShapeConvexHull(
      diceShapeMeshes[DiceType.D12],
      scene,
    ),
    [DiceType.D20]: new PhysicsShapeConvexHull(
      diceShapeMeshes[DiceType.D20],
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

  // Register dice material plugin
  RegisterMaterialPlugin('DiceMaterial', material => {
    const plugin = new DicePluginMaterial(
      material,
      new Color3(15 / 255, 118 / 255, 110 / 255),
    );
    (material as StandardDiceMaterial).dice = plugin;
    return plugin;
  });

  // Create dice material
  const material = new StandardMaterial('dice_mat') as StandardDiceMaterial;
  material.diffuseTexture = new Texture(fontAtlas, scene, {
    invertY: false,
  });
  // Create d4 material
  const d4material = material.clone('d4_mat') as StandardDiceMaterial;
  // Set dice textures
  material.dice.texture = new Texture(fontAtlas, scene, {
    invertY: false,
  });
  d4material.dice.texture = new Texture(d4fontAtlas, scene, {
    invertY: false,
  });

  // Create shape physics material
  const physicsMaterial: PhysicsMaterial = { restitution: 0.7, friction: 1 };

  for (const type of Object.values(DiceType)) {
    // Set dice material
    diceMeshes[type].material = type == DiceType.D4 ? d4material : material;

    // Set shape physics material
    diceShapes[type].material = physicsMaterial;

    // Get dice shape normals (remove faces with similar normals)
    diceShapeMeshes[type].updateFacetData();
    const seen: Vector3[] = [];
    diceShapeNormals[type] = diceShapeMeshes[type]
      .getFacetLocalNormals()
      .filter(n => {
        let notAdded = true;
        for (const seenN of seen) {
          if (
            Math.abs(seenN.x - n.x) <= 0.0001 &&
            Math.abs(seenN.y - n.y) <= 0.0001 &&
            Math.abs(seenN.z - n.z) <= 0.0001
          ) {
            notAdded = false;
            break;
          }
        }
        return notAdded ? seen.push(n) : false;
      });
  }
};

export const resetDice = () => {
  // Loop dice types
  Object.values(diceContainers).forEach(container => {
    // Dispose previous dice
    container.forEach(dice => {
      dice[0].dispose();
      dice[1].dispose();
    });
    // Clear container
    container.length = 0;
  });
};

export const throwDice = (type: DiceType, count: number) => {
  // No dice to throw
  if (count < 1) return;

  // Get the dice mesh template
  const meshTemplate = diceMeshes[type];

  // Create dice!
  const position = new Vector3(0, 8, 0);
  for (let i = 0; i < count; i++) {
    // Create new mesh from template
    const mesh = meshTemplate.clone(`${type}_${i}`);
    mesh.setEnabled(true);
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
    diceContainers[type].push([mesh, body]);

    // DEBUG
    // physicsViewer.showBody(body);
    // mesh.onDispose = () => {
    //   physicsViewer.hideBody(body);
    // };
  }
};

export const getDiceNumbers = () => {
  const result: { [type in DiceType]: number[] } = {
    [DiceType.D4]: [],
    [DiceType.D6]: [],
    [DiceType.D8]: [],
    [DiceType.D10]: [],
    [DiceType.D12]: [],
    [DiceType.D20]: [],
  };

  const normal = Vector3.Zero();
  const down = Vector3.Down();

  for (const type of Object.values(DiceType)) {
    const container = diceContainers[type];
    const resultType = result[type];
    const normals = diceShapeNormals[type];

    for (const [mesh] of container) {
      // Find face with normal most similar to down vector
      let bestI = 0;
      let bestD = 0;
      for (let i = 0; i < normals.length; i++) {
        // Get face normal
        Vector3.TransformNormalToRef(normals[i], mesh._localMatrix, normal);

        const d = Vector3.Dot(down, normal.negate());
        if (d < bestD) continue;
        bestD = d;
        bestI = i;
      }

      const number = normalIndexToNumber[type][bestI];
      console.log(number);
      resultType.push(number);
    }
  }

  return result;
};
