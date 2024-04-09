import { MutableRefObject, useEffect, useRef, useState } from 'react';
import {
  Engine,
  Scene,
  HavokPlugin,
  Vector3,
  SceneOptimizer,
  ScenePerformancePriority,
} from '@babylonjs/core';
import HavokPhysics from '@babylonjs/havok';

type SceneComponentProps = {
  onSceneReady: (scene: Scene) => void;
  onRender: (scene: Scene) => void;
};

function SceneComponent({ onSceneReady, onRender }: SceneComponentProps) {
  const reactCanvas: MutableRefObject<null | HTMLCanvasElement> = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;

    const engine = new Engine(canvas);

    const createScene = async () => {
      const scene = new Scene(engine);

      // Physics
      const havokInstance = await HavokPhysics();
      scene.enablePhysics(
        new Vector3(0, -50, 0),
        new HavokPlugin(true, havokInstance),
      );

      // Optimisations
      scene.autoClearDepthAndStencil = false;
      scene.performancePriority = ScenePerformancePriority.Aggressive;
      SceneOptimizer.OptimizeAsync(scene);

      await scene.whenReadyAsync();

      setLoading(false);
      onSceneReady(scene);

      return scene;
    };

    // Fit canvas to container
    const resize = () => {
      const container = document.getElementById('container');
      if (!container) return;
      reactCanvas.current!.width = container.clientWidth;
      reactCanvas.current!.height = container.clientHeight;
      engine.resize();
    };

    createScene().then(scene => {
      resize();
      window.addEventListener('resize', resize);
      engine.runRenderLoop(() => {
        onRender(scene);
        scene.render();
      });
    });

    return () => {
      engine.dispose();

      if (window) {
        window.removeEventListener('resize', resize);
      }
    };
  }, [onRender, onSceneReady]);

  return (
    <>
      <canvas
        ref={reactCanvas}
        className={`absolute focus-visible:outline-none ${loading && 'hidden'}`}
      />
      {loading && (
        <div className="flex size-full items-center justify-center bg-teal-700">
          <p className="animate-pulse text-3xl">Loading</p>
        </div>
      )}
    </>
  );
}

export default SceneComponent;
