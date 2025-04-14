import React from "react";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import { AnimatePresence, motion } from "framer-motion";
import { fromWei } from '@/helpers/wei'
import { getAddressLink } from '@/helpers/etherscan'
import { useStakeFactory } from '@/contexts/StakeFactoryContext'
import Counter from '@/components/ui/Counter'
const StakingPeriodCard = (options) => {
  const {
    period,
    apy,
    minDeposit,
    stakedTokens,
    decimals,
    users,
    tokenSymbol
  } = options
  return (
    <div
      className="bg-gray-50 rounded-lg shadow-md p-6 w-full lg:max-w-xs max-w-sm mx-auto"
    >
      {/* Подробная информация по вертикали */}
      <div className="space-y-4">
        {/* Период */}
        <div className="flex items-center justify-between border-b pb-2">
          <p className="text-gray-700 font-bold">Period:</p>
          <p className="text-blue-500 font-bold">
            {period}
          </p>
        </div>
        {/* APY */}
        <div className="flex items-center justify-between border-b pb-2">
          <p className="text-gray-700 font-bold">APY:</p>
          <p className="text-green-500 font-bold">
            {apy}%
            {/*
            <LoadingPlaceholder>
              <p className="pl-2 pr-2">{apy}%</p>
            </LoadingPlaceholder>
            */}
          </p>
        </div>
        <div className="flex items-center justify-between border-b pb-2">
          <p className="text-gray-700 font-bold">Min deposit:</p>
          <p className="text-green-500 font-bold">
            {minDeposit} {tokenSymbol}
          </p>
        </div>
        
        {/* Количество застейканных токенов */}
        <div className="flex items-center justify-between border-b pb-2">
          <p className="text-gray-700 font-bold">Staked Tokens:</p>
          <p className="text-orange-500 font-bold">
            <span className="block">
              <Counter>{fromWei(stakedTokens, decimals)}</Counter>
            </span>
            <span className="block">{tokenSymbol}</span>
          </p>
        </div>
        {/* Количество пользователей */}
        {/*
        <div className="flex items-center justify-between">
          <p className="text-gray-700 font-bold">Users:</p>
          <p className="text-purple-500 font-bold">{users}</p>
        </div>
        */}
      </div>
    </div>
  );
};

const StakingInfoBlock = (props) => {
  const {
    isFactoryError,
    isFetchingFactory,
    contractInfo,
    contractInfo: {
      lockPeriodsInfo = [],
      stakingTokenInfo = false,
      rewardTokenInfo = false,
      usersCount = false
    },
  } = useStakeFactory()

  const stakingToken = stakingTokenInfo.symbol
  const rewardToken = rewardTokenInfo.symbol
  
  const stakingData = lockPeriodsInfo.sort((a,b) => {
    return (a.lockTimeDays > b.lockTimeDays) ? 1 : -1
  }).map((info) => {
    return {
      id: info.lockTimeDays,
      period: `${info.lockTimeDays} days`,
      apy: info.percentageBasisPoints / 100,
      stakedTokens: info.stakedAmount,
      tokenSymbol: stakingTokenInfo.symbol,
      minDeposit:info.minimumDeposit,
      users: 0
    }
  })
  return (
    <div className="w-full p-6">
      <div className="bg-white rounded-lg shadow-md p-6 w-full mx-auto lg:max-w-6xl">
        {/* Блок Staking Overview (теперь снизу) */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Staking Overview</h2>
          <div className="flex justify-center flex-wrap gap-4">
            {/* Информация о токенах */}
            <div className="border p-4 rounded flex items-center justify-between bg-gray-50 w-full lg:max-w-xs  mx-auto">
              <p className="text-gray-700 font-bold">Total Staked Tokens:</p>
              {stakingTokenInfo ? (
                <a
                  className="text-green-500 font-bold ml-4"
                  href={getAddressLink(contractInfo.chainId, stakingTokenInfo.addr)}
                  target={`_blank`}
                >
                  <div>
                    <Counter>{fromWei(stakingTokenInfo.balance, stakingTokenInfo.decimals)}</Counter>
                  </div>
                  <div>{stakingTokenInfo.symbol}</div>
                </a>
              ) : (
                <p className="text-green-500 font-bold ml-4">{`...`}</p>
              )}
            </div>
            <div className="border p-4 rounded flex items-center justify-between bg-gray-50 w-full lg:max-w-xs  mx-auto">
              <p className="text-gray-700 font-bold">Reward Pool Size:</p>
              {rewardTokenInfo ? (
                <a 
                  className="text-blue-500 font-bold ml-4"
                  href={getAddressLink(contractInfo.chainId, rewardTokenInfo.addr)}
                  target={`_blank`}
                >
                  <div>
                    <Counter>{fromWei(rewardTokenInfo.balance, rewardTokenInfo.decimals)}</Counter>
                  </div>
                  <div>{rewardTokenInfo.symbol}</div>
                </a>
              ) : (
                <p className="text-blue-500 font-bold ml-4">{`...`}</p>
              )}
            </div>
            <div className="border p-4 rounded flex items-center justify-between bg-gray-50 w-full lg:max-w-xs  mx-auto">
              <p className="text-gray-700 font-bold">Total Users:</p>
              <p className="text-green-500 font-bold ml-4">
                {usersCount !== false ? (
                  <Counter>{usersCount}</Counter>
                ) : (
                  <>{`...`}</>
                )}
              </p>
            </div>
          </div>
        </div>
        {/* Блок Staking Periods (теперь сверху) */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold mb-4 mt-4">Staking Periods</h2>
          <div className="flex justify-center flex-wrap gap-4">
            {stakingData.length == 0 ? (
              <LoadingPlaceholder height={`256px`} />
            ) : (
              <>
                {stakingData.map((_period) => {
                  const {
                    period,
                    apy,
                    stakedTokens,
                    minDeposit,
                    tokenSymbol,
                    users
                  } = _period
                  return (
                    <StakingPeriodCard
                      key={period}
                      period={period}
                      apy={apy}
                      minDeposit={1}
                      stakedTokens={stakedTokens}
                      minDeposit={minDeposit}
                      tokenSymbol={tokenSymbol}
                      decimals={stakingTokenInfo.decimals}
                      users={users}
                    />
                  )
                })}
              </>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default StakingInfoBlock;