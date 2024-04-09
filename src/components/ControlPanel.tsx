import { DiceType } from 'types/dice';
import DiceSelector from 'components/DiceSelector';
import { MouseEvent, useState } from 'react';

function ControlPanel() {
  const diceTypes = Object.values(DiceType);
  const defaultValues = [0, 0, 0, 0, 0, 0];
  const [values, setValues] = useState(defaultValues);

  function onChange(type: DiceType, value: number) {
    setValues(v => {
      const tempValues = [...v];
      tempValues[diceTypes.indexOf(type)] = value;
      return tempValues;
    });
  }

  function reset(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setValues(defaultValues);
  }

  return (
    <form className="flex flex-col space-y-4">
      <div className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
        {diceTypes.map((type, idx) => (
          <DiceSelector
            key={idx}
            type={type}
            value={values[idx]}
            onChange={onChange}
          />
        ))}
      </div>

      <div className="flex flex-col space-y-2">
        <input
          type="submit"
          value="Roll!"
          className="btn"
          title="Roll the dice!"
        />
        <button
          className="btn bg-red-500 hover:bg-red-600"
          onClick={reset}
          title="Reset dice counts"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

export default ControlPanel;
