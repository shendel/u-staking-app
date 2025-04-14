import React, { useState, useEffect } from "react";
import StakingFormNewDeposit from './StakingForm/NewDeposit'

const StakingForm = (props) => {
  const {
    isFactoryError,
    isFetchingFactory,
    contractInfo,
  } = props

  const [mode, setMode] = useState("Stake"); // Изначальный режим: Stake
  const [selectedStakingId, setSelectedStakingId] = useState(null);
  const [unstakeAmount, setUnstakeAmount] = useState("");

  const [stakingPeriods, setStakingPeriods] = useState([
    {
      id: 1,
      token: "ETH",
      rewardToken: "dETH",
      days: 30,
      apy: 5, // APY в процентах
      remainingDays: 15, // Оставшиеся дни до награды
      stakedAmount: 10, // Стейкнутые токены
    },
    {
      id: 2,
      token: "BTC",
      rewardToken: "dBTC",
      days: 60,
      apy: 8, // APY в процентах
      remainingDays: 45, // Оставшиеся дни до награды
      stakedAmount: 2, // Стейкнутые токены
    },
  ]);



  const handleUnstakeInputChange = (e) => {
    setUnstakeAmount(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  if (isFetchingFactory) {
    return (
      <div>Loading</div>
    )
  }
  return (
    <div className="w-full p-6">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg mx-auto">
        <h2 className="text-center text-xl font-bold mb-4">Staking Form</h2>

        {/* Переключатели */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setMode("Stake")}
            className={`px-4 py-2 mr-2 bg-${
              mode === "Stake" ? "blue-500 text-white" : "gray-200 text-gray-700"
            } rounded hover:bg-blue-600 hover:text-white`}
          >
            Stake
          </button>
          <button
            onClick={() => setMode("Unstake")}
            className={`px-4 py-2 mr-2 bg-${
              mode === "Unstake" ? "blue-500 text-white" : "gray-200 text-gray-700"
            } rounded hover:bg-blue-600 hover:text-white`}
          >
            Unstake
          </button>
          <button
            onClick={() => setMode("Claim")}
            className={`px-4 py-2 bg-${
              mode === "Claim" ? "blue-500 text-white" : "gray-200 text-gray-700"
            } rounded hover:bg-blue-600 hover:text-white`}
          >
            Claim
          </button>
        </div>

        {/* Режим Stake */}
        {mode === "Stake" && (
          <>
            <StakingFormNewDeposit
              isFactoryError={isFactoryError}
              isFetchingFactory={isFetchingFactory}
              contractInfo={contractInfo}
            />
          </>
        )}

        {/* Режим Unstake */}
        {mode === "Unstake" && (
          <div>
            <p className="text-center text-gray-500 mb-6">
              Select a staking period to unstake tokens
            </p>

            {/* Список стейкинговых периодов */}
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">
                Staking Periods:
              </label>
              <div className="space-y-4">
                {stakingPeriods.map((period) => (
                  <div
                    key={period.id}
                    className="border p-4 rounded flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedStakingId(period.id)}
                  >
                    <div>
                      <p className="text-green-500 font-bold">
                        Staked: {period.stakedAmount} {period.token}
                      </p>
                      <p className="text-sm text-gray-500">
                        Days: {period.days}, APY: {period.apy}%, Remaining Days:{" "}
                        {period.remainingDays}
                      </p>
                    </div>
                    {selectedStakingId === period.id && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Unstake Amount */}
            {selectedStakingId !== null && (
              <div>
                {/* Transaction Details */}
                <div className="bg-gray-100 p-4 rounded mb-4">
                  <h3 className="text-lg font-bold mb-2">Transaction details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p>You will receive</p>
                      <p>Transaction cost</p>
                      <p>Early withdrawal fee</p>
                    </div>
                    <div>
                      <p>{unstakeAmount} ETH</p>
                      <p>$3.20 (0.002)</p>
                      <p>2%</p>
                    </div>
                  </div>
                </div>

                {/* Unstake Button */}
                <button
                  disabled={!selectedStakingId}
                  className={`w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                    unstakeAmount <= 0 || !selectedStakingId
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Unstake
                </button>
              </div>
            )}
          </div>
        )}

        {/* Режим Claim */}
        {mode === "Claim" && (
          <div>
            <p className="text-center text-gray-500 mb-6">Claim your rewards</p>

            {/* Claim Details */}
            <div className="bg-gray-100 p-4 rounded mb-4">
              <h3 className="text-lg font-bold mb-2">Reward details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>Your reward</p>
                  <p>Transaction cost</p>
                </div>
                <div>
                  <p>0.5 dETH</p>
                  <p>$1.20 (0.001)</p>
                </div>
              </div>
            </div>

            {/* Claim Button */}
            <button
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Claim
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StakingForm;