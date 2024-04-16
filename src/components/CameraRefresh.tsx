import RefreshIcon from 'assets/refresh.svg';
import { ReactSVG } from 'react-svg';
import { resetCamera } from 'scripts/camera';

function CameraRefresh() {
  return (
    <button
      title="Reset Camera"
      onClick={() => resetCamera()}
      className="btn-teal absolute right-0 z-10 m-2 rounded-full p-2"
    >
      <ReactSVG src={RefreshIcon} className="fill-teal-50" />
    </button>
  );
}

export default CameraRefresh;
