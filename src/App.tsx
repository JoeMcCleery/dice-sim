import ControlPanel from 'components/ControlPanel';

function App() {
  return (
    <div className="grid size-full grid-cols-1 grid-rows-[auto_1fr_auto] bg-teal-800 text-teal-50">
      <header className="bg-teal-500 p-4 text-center">
        <h1 className="bold text-3xl">3D Dice Simulator</h1>
      </header>
      <main className="m-auto grid size-full max-w-screen-lg grid-cols-1 grid-rows-[1fr_auto] lg:grid-cols-[1fr_auto] lg:grid-rows-1 lg:p-4">
        <div id="container">
          <div
            id="loading"
            className="flex size-full items-center justify-center bg-teal-700"
          >
            <p className="animate-pulse text-3xl">Loading</p>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center bg-teal-500 p-4">
          <ControlPanel />
        </div>
      </main>
      <footer className="space-x-4 bg-teal-600 p-2 text-center">
        By{' '}
        <a
          href="https://github.com/JoeMcCleery"
          target="_blank"
          className="underline"
          title="Joe McCleery Github Page"
        >
          Joe McC
        </a>
        <a
          href="https://github.com/JoeMcCleery/dice-sim"
          target="_blank"
          className="underline"
          title="Dice Simulator Github Page"
        >
          View Source Code
        </a>
      </footer>
    </div>
  );
}

export default App;
