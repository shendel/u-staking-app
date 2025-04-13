import React from "react";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import { fromWei } from '@/helpers/wei'
import { getAddressLink } from '@/helpers/etherscan'

const StakingPeriodCard = (options) => {
  const {
    period,
    apy,
    minDeposit,
    stakedTokens,
    users,
    tokenSymbol
  } = options
  return (
    <div className="bg-gray-50 rounded-lg shadow-md p-6 w-full lg:max-w-xs max-w-sm mx-auto">
      {/* Подробная информация по вертикали */}
      <div className="space-y-4">
        {/* Период */}
        <div className="flex items-center justify-between border-b pb-2">
          <p className="text-gray-700 font-bold">Period:</p>
          <p className="text-blue-500 font-bold">{period} days</p>
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
          <p className="text-orange-500 font-bold">{stakedTokens} {tokenSymbol}</p>
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
    isFetchingFactory,
    isFactoryError,
    contractInfo,
    contractInfo: {
      lockPeriodsInfo,
      stakingTokenInfo,
      rewardTokenInfo,
      usersCount
    },
  } = props

/*
  const stakingData = [
    {
      id: 1,
      period: "30 days",
      apy: 5, // APY в процентах
      stakedTokens: 1000, // Количество застейканных токенов
      users: 150, // Количество пользователей
    },
    {
      id: 2,
      period: "60 days",
      apy: 8, // APY в процентах
      stakedTokens: 2000, // Количество застейканных токенов
      users: 250, // Количество пользователей
    },
    {
      id: 3,
      period: "90 days",
      apy: 12, // APY в процентах
      stakedTokens: 3000, // Количество застейканных токенов
      users: 350, // Количество пользователей
    },
  ];
  */

  const totalStakedTokens = 0; /*stakingData.reduce(
    (sum, item) => sum + item.stakedTokens,
    0
  );
  */

  const rewardPoolSize = 5000; // Размер банка наград

  
  if (isFetchingFactory) {
    return (
      <div>Factory loading</div>
    )
  }
  
  const stakingToken = stakingTokenInfo.symbol
  const rewardToken = rewardTokenInfo.symbol
  
  const stakingData = lockPeriodsInfo.sort((a,b) => {
    return (a.lockTimeDays > b.lockTimeDays) ? 1 : -1
  }).map((info) => {
    /*  
      uint256 lockTimeDays;
      uint256 minimumDeposit;
      uint256 percentageBasisPoints;
      uint256 maxRate;            // Максимальная процентная ставка
      uint256 minRate;            // Минимальная процентная ставка
      uint256 decrementStep;      // Шаг снижения ставки
      uint256 stepSize;           // Размер шага в токенах
      bool    fixedBasisPoints;   // Фиксированная ставка APY
      uint256 stakedAmount;       // Кол-во застейканых токенов
    */
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
              <a
                className="text-green-500 font-bold ml-4"
                href={getAddressLink(contractInfo.chainId, stakingTokenInfo.addr)}
                target={`_blank`}
              >
                {fromWei(stakingTokenInfo.balance, stakingTokenInfo.decimals)} {stakingTokenInfo.symbol}
              </a>
            </div>
            <div className="border p-4 rounded flex items-center justify-between bg-gray-50 w-full lg:max-w-xs  mx-auto">
              <p className="text-gray-700 font-bold">Reward Pool Size:</p>
              <a 
                className="text-blue-500 font-bold ml-4"
                href={getAddressLink(contractInfo.chainId, rewardTokenInfo.addr)}
                target={`_blank`}
              >
                {fromWei(rewardTokenInfo.balance, rewardTokenInfo.decimals)} {rewardTokenInfo.symbol}
              </a>
            </div>
            <div className="border p-4 rounded flex items-center justify-between bg-gray-50 w-full lg:max-w-xs  mx-auto">
              <p className="text-gray-700 font-bold">Total Users:</p>
              <p className="text-green-500 font-bold ml-4">
                {usersCount}
              </p>
            </div>
          </div>
        </div>
        {/* Блок Staking Periods (теперь сверху) */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold mb-4 mt-4">Staking Periods</h2>
          <div className="flex justify-center flex-wrap gap-4">
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
                  users={users}
                />
              )
            })}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default StakingInfoBlock;