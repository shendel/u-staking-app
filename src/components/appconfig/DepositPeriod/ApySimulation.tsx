import React, { useState, useEffect } from "react";

const ApySimulation = (props) => {
  const {
    minRate,
    maxRate,
    decrementStep,
    stepSize,
  } = props

  console.log(props)
  const [maxTokens, setMaxTokens] = useState(1_000_000);

  const [currentTokens, setCurrentTokens] = useState(0);
  const handleSliderChange = (event) => {
    setCurrentTokens(Number(event.target.value));
  };

  // Расчет целевого APY
  const calculateTargetAPY = () => {
    const tokenBalance = currentTokens;
    const multiplier = Math.floor(tokenBalance / stepSize);
    const minusValue = multiplier * decrementStep;

    let apy = maxRate - minusValue;
    if (apy < minRate) {
      apy = minRate;
    }

    return apy / 100; // Преобразуем в проценты
  };

  useEffect(() => {
    calculateTargetAPY()
  }, [ minRate, maxRate, decrementStep, stepSize ])
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Целевой APY и выбранное количество токенов */}
      <div className="flex justify-center items-center mt-6">
        <p className="text-xl font-bold">
          Target APY:
          <span className="text-green">{calculateTargetAPY().toFixed(2)}%</span>
        </p>
        <p className="text-xl font-bold ml-4">
          Staked Tokens:
          <span className="text-green">{currentTokens}</span>
        </p>
      </div>

      {/* Ползунок */}
      <div className="flex justify-between items-center">
        <span>0 Min</span>
        <span>Max {maxTokens}</span>
      </div>
      <div className="">
        <input
          type="range"
          min="0"
          max={maxTokens}
          value={currentTokens}
          onChange={handleSliderChange}
          className="w-full h-2 bg-red-500 rounded-full appearance-none cursor-pointer select-none"
        />
      </div>
      {/* Максимальное количество токенов */}
      <div className="mt-4">
        <label htmlFor="maxTokens" className="block text-gray-700 font-bold mb-2">
          Staked tokens amount:
        </label>
        <input
          type="number"
          id="maxTokens"
          value={maxTokens}
          onChange={(e) => setMaxTokens(parseInt(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default ApySimulation;