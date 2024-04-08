import { DiceType } from 'types/dice';

type DiceSelectorProps = {
  type: DiceType;
};

function DiceSelector({ type }: DiceSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <label htmlFor={type}>{type}</label>
      <select id={type} name={type} className="input">
        {Array.from(Array(11).keys()).map(count => (
          <option key={count} value={count}>
            {count}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DiceSelector;
