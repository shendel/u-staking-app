import React from "react";
import calculateReward from '@/helpers_stake/calculateReward'
import { toWei, fromWei } from '@/helpers/wei'

const DepositDetails = (props) => {
  const {
    depositPeriod,
    depositPeriod: {
      percentageBasisPoints: apyBasisPoints
    },
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
      <h3 className="text-lg font-bold mb-2">{`Deposit Details`}</h3>
      <div className="grid grid-cols-2 gap-4">
        <p>APY</p>
        <p>{(apyBasisPoints / 100)} %</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <p>You will receive</p>
        <p className="text-green-500 text-right">{fromWei(rewardAmount, rewardTokenInfo.decimals)} {rewardTokenInfo.symbol}</p>
      </div>
    </div>
  );
};

export default DepositDetails;