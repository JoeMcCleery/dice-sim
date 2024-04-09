import { MouseEvent } from 'react';
import { DiceType } from 'types/dice';

type DiceSelectorProps = {
  type: DiceType;
  value: number;
  onChange: (type: DiceType, value: number) => void;
};

function DiceSelector({ type, value, onChange }: DiceSelectorProps) {
  const options = Array.from(Array(11).keys());

  function decrease(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    onChange(type, Math.max(value - 1, 0));
  }

  function increase(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    onChange(type, Math.min(value + 1, options.length - 1));
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <label htmlFor={type}>{type}</label>
      <div className="flex">
        <button
          className="input hidden w-8 rounded-r-none font-bold lg:inline-block"
          onClick={decrease}
          title={`Decrease ${type} count`}
        >
          -
        </button>
        <select
          id={type}
          name={type}
          className="input lg:rounded-none"
          value={value}
          onChange={e => onChange(type, parseInt(e.target.value))}
          title={`Select ${type} count`}
        >
          {options.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          className="input hidden w-8 rounded-l-none font-bold lg:inline-block"
          onClick={increase}
          title={`Increase ${type} count`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default DiceSelector;
