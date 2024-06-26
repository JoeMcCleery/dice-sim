import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Engine } from '@babylonjs/core';
import { createScene, scene } from 'scripts/scene';
import CameraRefresh from 'components/ResetSceneButton';
import SimulationResult from 'components/SimulationResult';

type SceneComponentProps = {
  onSceneReady: () => Promise<void>;
  onPostRender: () => void;
};

function SceneComponent({ onSceneReady, onPostRender }: SceneComponentProps) {
  const reactCanvas: MutableRefObject<null | HTMLCanvasElement> = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get canvas element
    const canvas = reactCanvas.current;
    if (!canvas) return;

    // Create engine
    const engine = new Engine(canvas);

    // Resize canvas
    const resize = () => {
      engine.setSize(
        canvas.parentElement!.clientWidth,
        canvas.parentElement!.clientHeight,
      );
    };
    resize();
    window.addEventListener('resize', resize);

    // Render loop
    const renderLoop = () => {
      scene.render();
      onPostRender();
    };

    // Create scene
    createScene(engine).then(async () => {
      // Exit early if engine was disposed during scene creation
      if (engine.isDisposed) return;

      // Scene ready callback
      await onSceneReady();
      setLoading(false);

      // Run render loop
      engine.runRenderLoop(renderLoop);
    });

    // Dispose
    return () => {
      // Dispose engine
      engine.dispose();

      // Remove resize event listener
      if (window) {
        window.removeEventListener('resize', resize);
      }
    };
  }, [onPostRender, onSceneReady]);

  return (
    <>
      <canvas
        ref={reactCanvas}
        className={`absolute focus-visible:outline-none ${loading && 'hidden'}`}
      />
      {loading ? (
        <div className="flex size-full items-center justify-center bg-teal-700">
          <p className="animate-pulse text-3xl">Loading</p>
        </div>
      ) : (
        <>
          <SimulationResult />
          <CameraRefresh />
        </>
      )}
    </>
  );
}

export default SceneComponent;
