import React, { useState, useEffect } from "react";
import InputAmount from '@/components/ui/InputAmount'
import fetchTokenAllowance from '@/helpers/fetchTokenAllowance'
import fetchTokenBalance from '@/helpers/fetchTokenBalance'

import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import BigNumber from "bignumber.js"
import { toWei, fromWei } from '@/helpers/wei'


const StakingFormNewDeposit = (props) => {
  const {
    isFactoryError,
    isFetchingFactory,
    contractInfo,
    contractInfo: {
      chainId,
      address: factoryAddress,
      stakingTokenInfo,
      rewardTokenInfo,
      lockPeriodsInfo,
    }
  } = props
  
  const {
    injectedWeb3,
    injectedAccount,
    injectedChainId
  } = useInjectedWeb3()

  const [stakeAmount, setStakeAmount] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  const [ isBalanceFetching, setIsBalanceFetching ] = useState(false)
  const [ tokenBalance, setTokenBalance ] = useState(0)

  const notEnoghtBalance = !!(stakeAmount > tokenBalance)
  
  const [ isTokenAllowanceFetching, setIsTokenAllowanceFetching ] = useState(true)
  const [ tokenAllowance, setTokenAllowance ] = useState(0)

  useEffect(() => {
    if (injectedAccount && stakingTokenInfo && stakingTokenInfo.addr) {
      setTokenBalance(0)
      setIsBalanceFetching(true)
      fetchTokenBalance({
        wallet: injectedAccount,
        tokenAddress: stakingTokenInfo.addr,
        chainId
      }).then((answer) => {
        setIsBalanceFetching(false)
        if (answer) {
          const { normalized } = answer
          setTokenBalance(normalized)
        }
        console.log('>>> tokenBalance', answer)
      }).catch((err) => {
      setIsBalanceFetching(false)
        console.log('>>> err', err)
      })
    } else {
      setTokenBalance(0)
    }
  }, [ injectedAccount, stakingTokenInfo ])
  
  useEffect(() => {
    if (injectedAccount && factoryAddress && stakingTokenInfo && stakingTokenInfo.addr) {
      setIsTokenAllowanceFetching(true)
      fetchTokenAllowance({
        from: injectedAccount,
        to: factoryAddress,
        tokenAddress: stakingTokenInfo.addr,
        chainId
      }).then(({ allowance }) => {
        setTokenAllowance(new BigNumber(allowance))
        setIsTokenAllowanceFetching(false)
      }).catch((err) => {
        console.log('Fail fetch allowance', err)
        setIsTokenAllowanceFetching(false)
        setTokenAllowance(0)
      })
    } else {
      setIsTokenAllowanceFetching(false)
      setTokenAllowance(0)
    }
  }, [ injectedAccount, factoryAddress, stakingTokenInfo ])

  const handleInputChange = (v) => {
    setStakeAmount(v)
  }
  
  const lockPeriods = lockPeriodsInfo.sort((a,b) => { return (a.lockTimeDays > b.lockTimeDays) ? 1 : -1 })
  const [ lockPeriod, setLockPeriod ] = useState(0)
  
  const handleChangeLockPeriod = (days) => {
    setLockPeriod(days)
  }
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const isNeedApprove = new BigNumber(toWei(stakeAmount, stakingTokenInfo.decimals)).isGreaterThan(tokenAllowance)
  
  return (
    <div>
      <p className="text-center text-gray-500 mb-6">
        Stake ETH and receive dETH while staking
      </p>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          {`Deposit Lock period`}
        </label>
        <select
          value={lockPeriod} onChange={(e) => { handleChangeLockPeriod(e.target.value) }}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        >
          <option value={0}>Select Period</option>
          {lockPeriods.map(({ lockTimeDays }) => {
            return (
              <option key={lockTimeDays} value={lockTimeDays}>{`${lockTimeDays} Days`}</option>
            )
          })}
        </select>
      </div>
      {/* Stake Amount */}
      <div className="mb-4">
        <InputAmount
          value={stakeAmount}
          chainId={chainId}
          onChange={setStakeAmount}
          tokenInfo={stakingTokenInfo}
          tokenBalance={tokenBalance}
          isDisabled={(lockPeriod == 0)}
        />
      </div>
      
      {/* Transaction Details */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="text-lg font-bold mb-2">Transaction details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>You will receive</p>
            <p>Exchange rate</p>
            <p>Transaction cost</p>
            <p>Reward fee</p>
            <p>Annual percentage rate</p>
          </div>
          <div>
            <p>3.82 dETH</p>
            <p>1 ETH = 1 dETH</p>
            <p>$3.20 (0.002)</p>
            <p>10%</p>
            <p className="text-green-500">4.3%</p>
          </div>
        </div>
      </div>

      {/* Checkbox */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="termsCheckbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="mr-2"
        />
        <label htmlFor="termsCheckbox" className="text-gray-700">
          I have read and I accept the{" "}
          <a href="#" className="text-blue-500 underline">
            terms and conditions
          </a>
        </label>
      </div>

      {/* Stake Button */}
      <button
        disabled={!isChecked || stakeAmount <= 0}
        className={`w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
          !isChecked || stakeAmount <= 0 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Stake
      </button>
    </div>
  )
};

export default StakingFormNewDeposit;