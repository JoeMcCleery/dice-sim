import RefreshIcon from 'assets/refresh.svg';
import { MouseEvent } from 'react';
import { ReactSVG } from 'react-svg';
import { resetCamera } from 'scripts/camera';
import { resetDice } from 'scripts/dice';

function ResetSceneButton() {
  function resetScene(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    resetDice();
    resetCamera();
  }
  return (
    <div className="absolute right-2 top-2">
      <button
        title="Reset Scene"
        onClick={resetScene}
        className="btn-teal rounded-full p-2"
      >
        <ReactSVG src={RefreshIcon} className="fill-teal-50" />
      </button>
    </div>
  );
}

export default ResetSceneButton;
