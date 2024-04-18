import { DiceType } from 'scripts/dice';

type DiceSelectorProps = {
  type: DiceType;
  value: number;
  onChange: (type: DiceType, value: number) => void;
};

function DiceSelector({ type, value, onChange }: DiceSelectorProps) {
  const options = Array.from(Array(51).keys());

  function decrease() {
    onChange(type, Math.max(value - 1, 0));
  }

  function increase() {
    onChange(type, Math.min(value + 1, options.length - 1));
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <label htmlFor={type}>{type}</label>
      <div className="flex">
        <input
          type="button"
          value="-"
          title={`Decrease ${type} count`}
          className="input hidden w-8 rounded-r-none font-bold md:inline-block"
          onClick={decrease}
        />
        <select
          id={type}
          name={type}
          value={value}
          title={`Select ${type} count`}
          className="input md:rounded-none"
          onChange={e => onChange(type, parseInt(e.target.value))}
        >
          {options.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input
          type="button"
          value="+"
          title={`Increase ${type} count`}
          className="input hidden w-8 rounded-l-none font-bold md:inline-block"
          onClick={increase}
        />
      </div>
    </div>
  );
}

export default DiceSelector;
