import DiceSelector from 'components/DiceSelector';
import { MouseEvent, useState } from 'react';
import { resetDice, throwDice, DiceType } from 'scripts/dice';
import { scene } from 'scripts/scene';

function ControlPanel() {
  const diceTypes = Object.values(DiceType);
  const [defaultValues] = useState([0, 0, 0, 0, 0, 0]);
  const [values, setValues] = useState(defaultValues);

  function onChange(type: DiceType, value: number) {
    setValues(v => {
      const tempValues = [...v];
      tempValues[diceTypes.indexOf(type)] = value;
      return tempValues;
    });
  }

  function submit(e: MouseEvent<HTMLInputElement>) {
    e.preventDefault();
    // Cannot throw dice without scene
    if (!scene || scene.isDisposed) return;
    // Reset dice
    resetDice();
    // Throw the dice!
    for (let i = 0; i < values.length; i++) {
      throwDice(diceTypes[i], values[i]);
    }
  }

  function reset(e: MouseEvent<HTMLInputElement>) {
    e.preventDefault();
    setValues(defaultValues);
  }

  return (
    <form className="flex flex-col space-y-4">
      <div className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-2">
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
          title="Roll the dice!"
          className="btn-blue"
          onClick={submit}
        />
        <input
          type="reset"
          value="Reset"
          title="Reset dice counts"
          className="btn-red"
          onClick={reset}
        />
      </div>
    </form>
  );
}

export default ControlPanel;
