import React, { useState, useEffect } from "react";
import StakingFormNewDeposit from './StakingForm/NewDeposit'
import StakingFormUserDeposits from './StakingForm/UserDeposits'
import StakingFormClaimReward from './StakingForm/ClaimReward'


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

  
  if (/* isFetchingFactory && */ !contractInfo) {
    return (
      <div>Loading</div>
    )
  }

  return (
    <div className="w-full p-6">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg mx-auto">
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
              onStake={() => { setMode("Unstake") }}
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
          <StakingFormClaimReward
            isFactoryError={isFactoryError}
            isFetchingFactory={isFetchingFactory}
            contractInfo={contractInfo}
          />
        )}
      </div>
    </div>
  );
};

export default StakingForm;