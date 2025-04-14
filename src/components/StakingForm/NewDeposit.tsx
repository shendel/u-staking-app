import React, { useState, useEffect } from "react";
import InputAmount from '@/components/ui/InputAmount'
import fetchTokenAllowance from '@/helpers/fetchTokenAllowance'
import fetchTokenBalance from '@/helpers/fetchTokenBalance'
import approveToken from '@/helpers/approveToken'
import DepositDetails from './DepositDetails'
import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import BigNumber from "bignumber.js"
import { toWei, fromWei } from '@/helpers/wei'
import calculateReward from '@/helpers_stake/calculateReward'
import depositTokens from '@/helpers_stake/depositTokens'
import Button from '@/components/ui/Button'
import { GET_CHAIN_BYID } from '@/web3/chains'
import { useNotification } from "@/contexts/NotificationContext";
import { getTransactionLink, getShortTxHash } from '@/helpers/etherscan'
import { useStakeFactory } from '@/contexts/StakeFactoryContext'


const StakingFormNewDeposit = (props) => {
  const {
    injectedWeb3,
    injectedAccount,
    injectedChainId,
    switchNetwork,
    isSwitchingNetwork,
  } = useInjectedWeb3()

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
    },
    fetchFactoryInfo
  } = useStakeFactory()
  console.log('>>> fetchFactoryInfo', fetchFactoryInfo)
  const { addNotification } = useNotification();
  
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
  const [ isApproving, setIsApproving ] = useState(false)
  
  const handleApproveToken = () => {
    addNotification('info', `Approving ${stakingTokenInfo.symbol}. Confirm transaction`)
    setIsApproving(true)
    approveToken({
      activeWallet: injectedAccount,
      activeWeb3: injectedWeb3,
      tokenAddress: stakingTokenInfo.addr,
      approveFor: contractInfo.address,
      weiAmount: toWei(stakeAmount, stakingTokenInfo.decimals),
      onTrx: (txHash) => {
        addNotification('info', 'Approving transaction', getTransactionLink(chainId, txHash), getShortTxHash(txHash))
      },
      onSuccess: () => {
        addNotification('success', `Token ${stakingTokenInfo.symbol} successfull approved`)
        setIsApproving(false)
        setTokenAllowance(toWei(stakeAmount, stakingTokenInfo.decimals))
      },
      onError: () => {
        addNotification('error', 'Fail approving')
        setIsApproving(false)
      }
    }).catch((err) => {})
  }
  
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
  
  const [ hasAmountError, setHasAmountError ] = useState(false)
  
  const lockPeriods = lockPeriodsInfo.sort((a,b) => { return (a.lockTimeDays > b.lockTimeDays) ? 1 : -1 })
  const [ lockPeriodDetails, setLockPeriodDetails ] = useState(false)
  const [ lockPeriod, setLockPeriod ] = useState(0)
  
  const handleChangeLockPeriod = (days) => {
    setLockPeriod(days)
    if (days) {
      setLockPeriodDetails(lockPeriodsInfo.find(({ lockTimeDays }) => lockTimeDays == days))
    } else {
      setLockPeriodDetails(false)
    }
  }
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const [ isDepositing, setIsDepositiong ] = useState(false)
  
  const handleDepositTokens = () => {
    setIsDepositiong(true)
    addNotification('info', `Deposit ${stakeAmount} ${stakingTokenInfo.symbol} for ${lockPeriod} days. Confirm transaction`)
    depositTokens({
      activeWeb3: injectedWeb3,
      stakeFactoryAddress: factoryAddress,
      lockDays: lockPeriod,
      amountWei: toWei(stakeAmount, stakingTokenInfo.decimals),
      onTrx: (txHash) => {
        addNotification('info', 'Deposit transaction', getTransactionLink(chainId, txHash), getShortTxHash(txHash))
      },
      onSuccess: () => {
        setIsDepositiong(false)
        addNotification('success', 'Successfull deposited')
        console.log('>>> CALL FETCH FACTORY INFO', fetchFactoryInfo)
        fetchFactoryInfo()
      },
      onError: () => {
        addNotification('error', 'Fail deposit tokens')
        setIsDepositiong(false)
      }
    }).catch((err) => {})
  }
  
  const isNeedApprove = new BigNumber(toWei(stakeAmount, stakingTokenInfo.decimals)).isGreaterThan(tokenAllowance)

  return (
    <div>
      <p className="text-center text-gray-500 mb-6">
        Stake ETH and receive dETH while staking
      </p>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 font-bold">
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
          setHasAmountError={setHasAmountError}
          isDisabled={(lockPeriod == 0)}
          minimumAmount={((lockPeriodDetails) ? lockPeriodDetails.minimumDeposit : false)}
        />
      </div>
      
      {/* Transaction Details */}
      {lockPeriodDetails && (stakeAmount > 0) && !hasAmountError && (
        <DepositDetails
          depositPeriod={lockPeriodDetails}
          stakeAmount={stakeAmount}
          stakingTokenInfo={stakingTokenInfo}
          rewardTokenInfo={rewardTokenInfo}
        />
      )}

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

      {injectedChainId != chainId ? (
        <Button isBold={true} fullWidth={true} onClick={() => { switchNetwork(chainId) }}>
          {`Switch to "${GET_CHAIN_BYID(chainId).name}"`}
        </Button>
      ) : (
        <>
          {isNeedApprove ? (
            <Button fullWidth={true} isBold={true} isDisabled={!isChecked} onClick={handleApproveToken} isLoading={isApproving}>
              {`Approve ${stakeAmount} ${stakingTokenInfo.symbol}`}
            </Button>
          ) : (
            <Button isDisabled={!isChecked || stakeAmount <= 0} isLoading={isDepositing} fullWidth={true} isBold={true} onClick={handleDepositTokens}>
              Stake
            </Button>
          )}
        </>
      )}
    </div>
  )
};

export default StakingFormNewDeposit;