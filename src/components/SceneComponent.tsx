import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Engine, Scene, HavokPlugin, Vector3 } from '@babylonjs/core';
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

    const engine = new Engine(canvas, false, {}, false);

    const createScene = async () => {
      const scene = new Scene(engine, {});

      const havokInstance = await HavokPhysics();
      const havokPlugin = new HavokPlugin(true, havokInstance);
      scene.enablePhysics(new Vector3(0, -20, 0), havokPlugin);

      await scene.whenReadyAsync();

      setLoading(false);
      onSceneReady(scene);

      return scene;
    };

    const resize = () => {
      const container = document.getElementById('container');
      if (!container) return;
      reactCanvas.current?.setAttribute(
        'width',
        container.clientWidth.toString(),
      );
      reactCanvas.current?.setAttribute(
        'height',
        container.clientHeight.toString(),
      );
      engine.resize();
    };

    createScene().then(scene => {
      resize();
      engine.runRenderLoop(() => {
        onRender(scene);
        scene.render();
      });
    });

    const onWindowResize = () => {
      resize();
    };

    window.addEventListener('resize', onWindowResize);

    return () => {
      engine.dispose();

      if (window) {
        window.removeEventListener('resize', onWindowResize);
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
