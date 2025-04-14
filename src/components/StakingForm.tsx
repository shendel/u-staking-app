import React, { useState, useEffect } from "react";
import StakingFormNewDeposit from './StakingForm/NewDeposit'
import StakingFormUserDeposits from './StakingForm/UserDeposits'

const StakingForm = (props) => {
  const {
    isFactoryError,
    isFetchingFactory,
    contractInfo,
  } = props

  const [mode, setMode] = useState("Stake"); // Изначальный режим: Stake
 


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
          <StakingFormUserDeposits
            isFactoryError={isFactoryError}
            isFetchingFactory={isFetchingFactory}
            contractInfo={contractInfo}
          />
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