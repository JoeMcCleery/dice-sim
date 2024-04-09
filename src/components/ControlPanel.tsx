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

  function submit(e: MouseEvent<HTMLInputElement>) {
    e.preventDefault();
    console.log(values);
  }

  function reset(e: MouseEvent<HTMLInputElement>) {
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
