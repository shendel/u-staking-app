import React from "react";
import calculateReward from '@/helpers_stake/calculateReward'
import { toWei, fromWei } from '@/helpers/wei'

const DepositDetails = (props) => {
  const {
    depositPeriod,
    depositPeriod: {
      lockTimeDays: days,
      percentageBasisPoints: apyBasisPoints
    },
    deductionPercentage,
    stakingTokenInfo,
    rewardTokenInfo,
    stakeAmount
  } = props
  
  const rewardAmount = calculateReward({
    stakedAmountWei: toWei(stakeAmount, stakingTokenInfo.decimals),
    depositTokenDecimals: stakingTokenInfo.decimals,
    rewardTokenDecimals: rewardTokenInfo.decimals,
    apyBasisPoints
  })

  return (
    <div className="bg-gray-100 p-4 rounded mb-4">
      <h3 className="text-lg font-bold mb-2 text-gray-700">{`Deposit Details`}</h3>
      <div className="text-gray-700 font-bold">
        <div className="grid grid-cols-2 gap-4 pb-1 border-b border-gray-300">
          <span>{`Lock rediod (days)`}</span>
          <span className="text-right text-green-600">{days}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 pb-1 pt-1 border-b border-gray-300">
          <span>{`APY`}</span>
          <span className="text-right text-green-600">
            {(apyBasisPoints / 100)}
            {`%`}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 pb-1 pt-1 border-b border-gray-300">
          <span>{`You will receive`}</span>
          <span className="text-green-600 text-right">
            {fromWei(rewardAmount, rewardTokenInfo.decimals)}
            {` `}
            {rewardTokenInfo.symbol}
          </span>
        </div>
        {deductionPercentage && (
          <div className="grid grid-cols-2 gap-4 pb-1 pt-1 border-b border-gray-300">
            <span>{`Penalty for early withdrawal`}</span>
            <div className="text-right">
              <div className="text-red-600">
                {deductionPercentage / 100}
                {`%`}
              </div>
              <div className="text-red-600">
                {(stakeAmount / 10000 * deductionPercentage)}
                {` `}
                {stakingTokenInfo.symbol}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositDetails;