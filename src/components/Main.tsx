import ControlPanel from './ControlPanel';
import DiceSimulation from './DiceSimulation';

function Main() {
  return (
    <main className="md:p-4">
      <div className="m-auto grid size-full max-w-screen-lg grid-cols-1 grid-rows-[1fr_auto] overflow-hidden md:grid-cols-[1fr_auto] md:grid-rows-1 md:rounded">
        <div id="container" className="relative min-h-24">
          <DiceSimulation />
        </div>
        <div className="flex w-full flex-col items-center justify-center bg-teal-500 p-4">
          <ControlPanel />
        </div>
      </div>
    </main>
  );
}

export default Main;
