import { useEffect, useState } from 'react';
import { DiceType, resultsObserver } from 'scripts/dice';

function SimulationResult() {
  const [result, setResult] = useState<Map<DiceType, number[]>>(
    new Map<DiceType, number[]>(),
  );

  useEffect(() => {
    resultsObserver.subscribe(setResult);
    return () => resultsObserver.unsubscribe(setResult);
  }, []);

  const formattedResult = Array.from(result);

  const total = formattedResult.reduce((acc, [, numbers]) => {
    return acc + numbers.reduce((sum, num) => (sum += num), 0);
  }, 0);

  return (
    <>
      {formattedResult.length && (
        <div className="absolute mr-14 space-y-2 rounded-br bg-teal-600/80 p-2">
          {formattedResult.map(([type, numbers], idx) => (
            <div key={idx} className="flex space-x-1">
              <p className="font-bold">{type}:</p>
              <p>{numbers.join(', ')}</p>
            </div>
          ))}
          <div className="flex space-x-1">
            <p className="text-lg font-bold">Total:</p>
            <p className="text-lg">{total}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default SimulationResult;
