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
    <button
      title="Reset Scene"
      onClick={resetScene}
      className="btn-teal absolute right-0 z-10 m-2 rounded-full p-2"
    >
      <ReactSVG src={RefreshIcon} className="fill-teal-50" />
    </button>
  );
}

export default ResetSceneButton;
