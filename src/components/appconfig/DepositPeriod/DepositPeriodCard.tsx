import React, { useState } from "react";

const DepositPeriodCard = ({ periodIndex, periodData, onChange }) => {
  const [rateType, setRateType] = useState("dynamic"); // Фиксированная или динамическая ставка

  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-4">
      <h3 className="text-xl font-bold mb-4">Period {periodIndex + 1}</h3>

      {/* Выпадающий список для типа ставки */}
      <div className="mb-4">
        <label htmlFor={`rateType-${periodIndex}`} className="block text-gray-700 font-bold mb-2">
          Rate Type:
        </label>
        <select
          id={`rateType-${periodIndex}`}
          value={rateType}
          onChange={(e) => setRateType(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        >
          <option value="fixed">Fixed Rate</option>
          <option value="dynamic">Dynamic Rate</option>
        </select>
      </div>

      {/* Параметры периода */}
      <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-4">
        {/* Lock Time (Days) */}
        <div>
          <label htmlFor={`lockTimeDays-${periodIndex}`} className="block text-gray-700 font-bold mb-2">
            Lock Time (Days):
          </label>
          <input
            type="number"
            id={`lockTimeDays-${periodIndex}`}
            value={periodData.lockTimeDays}
            onChange={(e) =>
              onChange(periodIndex, "lockTimeDays", parseInt(e.target.value))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Percentage Basis Points */}
        <div>
          <label htmlFor={`percentageBasisPoints-${periodIndex}`} className="block text-gray-700 font-bold mb-2">
            Percentage Basis Points:
          </label>
          <input
            type="number"
            id={`percentageBasisPoints-${periodIndex}`}
            value={periodData.percentageBasisPoints}
            onChange={(e) =>
              onChange(
                periodIndex,
                "percentageBasisPoints",
                parseInt(e.target.value)
              )
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Max Rate */}
        <div>
          <label htmlFor={`maxRate-${periodIndex}`} className="block text-gray-700 font-bold mb-2">
            Max Rate (Basis Points):
          </label>
          <input
            type="number"
            id={`maxRate-${periodIndex}`}
            value={periodData.maxRate}
            onChange={(e) =>
              onChange(periodIndex, "maxRate", parseInt(e.target.value))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Min Rate */}
        <div>
          <label htmlFor={`minRate-${periodIndex}`} className="block text-gray-700 font-bold mb-2">
            Min Rate (Basis Points):
          </label>
          <input
            type="number"
            id={`minRate-${periodIndex}`}
            value={periodData.minRate}
            onChange={(e) =>
              onChange(periodIndex, "minRate", parseInt(e.target.value))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Decrement Step */}
        <div>
          <label htmlFor={`decrementStep-${periodIndex}`} className="block text-gray-700 font-bold mb-2">
            Decrement Step (Basis Points):
          </label>
          <input
            type="number"
            id={`decrementStep-${periodIndex}`}
            value={periodData.decrementStep}
            onChange={(e) =>
              onChange(
                periodIndex,
                "decrementStep",
                parseInt(e.target.value)
              )
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Step Size */}
        <div>
          <label htmlFor={`stepSize-${periodIndex}`} className="block text-gray-700 font-bold mb-2">
            Step Size (Tokens):
          </label>
          <input
            type="number"
            id={`stepSize-${periodIndex}`}
            value={periodData.stepSize}
            onChange={(e) =>
              onChange(periodIndex, "stepSize", parseInt(e.target.value))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      {/* Кнопки управления справа */}
      <div className="flex justify-end mt-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded ml-2 hover:bg-red-600"
        >
          Delete
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded ml-2 hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded ml-2 hover:bg-green-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default DepositPeriodCard;