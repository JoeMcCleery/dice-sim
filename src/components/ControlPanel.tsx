import { DiceType } from 'types/dice';
import DiceSelector from 'components/DiceSelector';

function ControlPanel() {
  return (
    <div>
      <form className="flex space-x-4 lg:flex-col lg:space-x-0 lg:space-y-4">
        <div className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
          {Object.values(DiceType).map(type => (
            <DiceSelector key={type} type={type} />
          ))}
        </div>

        <input type="submit" value="Roll!" className="btn" />
      </form>
    </div>
  );
}

export default ControlPanel;
