import { useState, useEffect } from 'react'
import fetchUserDeposits from '@/helpers_stake/fetchUserDeposits'
import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import { fromWei } from '@/helpers/wei'
import calculateReward from '@/helpers_stake/calculateReward'
import Button from '@/components/ui/Button'
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import harvestTokens from '@/helpers_stake/harvestTokens'
import { useNotification } from "@/contexts/NotificationContext";
import { useConfirmationModal } from "@/components/ConfirmationModal";
import { getTransactionLink, getShortTxHash } from '@/helpers/etherscan'

export default function StakingFormUserDeposits(props) {
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
      deductionPercentage
    }
  } = props

  const {
    injectedAccount,
    injectedWeb3,
  } = useInjectedWeb3()

  const { openModal } = useConfirmationModal();
  const { addNotification } = useNotification();
  
  const getApy = (days) => {
    const period = lockPeriodsInfo.find(({ lockTimeDays }) => (lockTimeDays == days))
    if (period) {
      return period.percentageBasisPoints
    }
    return 0
  }
  const [ isFetchingPeriods, setIsFetchingPeriods ] = useState(false)
  const [ userLocks, setUserLocks ] = useState([])
  
  const doFetchUsersPeriods = () => {
    setIsFetchingPeriods(true)
    fetchUserDeposits({
      factoryAddress,
      chainId,
      userAddress: injectedAccount
    }).then((answer) => {
      setIsFetchingPeriods(false)
      const {
        periods
      } = answer
      setUserLocks(periods)
      console.log('>>> user periods', answer)
    }).catch((err) => {
      setIsFetchingPeriods(false)
      console.log('>>> fail fetch user periods', err)
    })
  }

  useEffect(() => {
    if (injectedAccount && factoryAddress && chainId) {
      doFetchUsersPeriods()
    }
  }, [ injectedAccount, factoryAddress, chainId ])
  
  const [ isHarvesting, setIsHarvesting ] = useState(false)
  const [ harvestingIndex, setHarvestiongIndex ] = useState(0)
  
  const handleHarvest = (day, index, isClaim = true) => {
    setHarvestiongIndex(index)
    setIsHarvesting(true)
    addNotification('info', (isClaim) ? 'Claiming reward. Confirm transaction' : 'Withdrawing deposit. Confirm transaction')
    harvestTokens({
      activeWeb3: injectedWeb3,
      stakeFactoryAddress: factoryAddress,
      locksIndexes: [ index ],
      onTrx: (txHash) => {
        addNotification('info',
          (isClaim)
            ? `Claiming transaction`
            : `Withdrawing transaction`,
          getTransactionLink(chainId, txHash),
          getShortTxHash(txHash)
        )
      },
      onSuccess: () => {
        setIsHarvesting(false)
        addNotification('success',
          (isClaim)
            ? 'Successfull claimed'
            : 'Successfull withdrawed'
        )
      },
      onError: () => {
        setIsHarvesting(false)
        addNotification('error',
          (isClaim)
            ? 'Claim is failed'
            : 'Withdraw is failed'
        )
      },
    }).catch((err) => {})
  }
  
  const handleWithdraw = (day, index) => {
    handleHarvest(day, index, false)
    // Do you really want to close this deposit before the unlock time? In this case, you will have to pay a penalty of 20% of the deposit amount
  }
  return (
    <div>
      <p className="text-center text-gray-500 mb-6">
        Select a staking period to unstake tokens
      </p>

      {/* Список стейкинговых периодов */}
      <div>
        <label className="block text-gray-700 font-bold mb-2">
          You locks:
        </label>
        {(isFetchingPeriods && userLocks.length == 0) ? (
          <LoadingPlaceholder height={128}/>
        ) : (
          <>
            {userLocks.length > 0 ? (
              <ul>
                {userLocks.map((item, index) => {
                  const {
                    days,
                    remaingDays,
                    amount,
                    canClaim
                  } = item
                  return (
                    <li key={index} className="mb-4 bg-gray-100 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 font-bold text-gray-700 border-b pb-1">
                        <span>
                          {`Staked:`}
                        </span>
                        <p className="text-right text-orange-500">
                          {fromWei(item.amount, stakingTokenInfo.decimals)}
                          {` `}
                          {stakingTokenInfo.symbol}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 font-bold text-gray-700 border-b pb-1 pt-1">
                        <span>
                          {(canClaim) ? `Reward:` : `Remaining reward:`}
                        </span>
                        <span className="text-right text-orange-500">
                          {fromWei(
                            calculateReward({
                              stakedAmountWei: item.amount,
                              depositTokenDecimals: stakingTokenInfo.decimals,
                              rewardTokenDecimals: rewardTokenInfo.decimals,
                              apyBasisPoints: getApy(item.days)
                            }),
                            rewardTokenInfo.decimals
                          )}
                          {` `}
                          {rewardTokenInfo.symbol}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 font-bold text-gray-700 border-b pb-1 pt-1">
                        <span>
                          {`APY:`}
                        </span>
                        <span className="font-bold text-right text-green-700">
                          {getApy(days) / 100}%
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 font-bold text-gray-700 border-b pb-1 pt-1">
                        <span>
                          {`Lock period (days): `}
                        </span>
                        <span className="text-blue-500 text-right">{item.days}</span>
                      </div>
                      {canClaim ? (
                        <div className="w-full">
                          <Button
                            color={`green`}
                            fullWidth={true}
                            isBold={true}
                            isDisabled={(isHarvesting && (harvestingIndex != index))}
                            isLoading={(isHarvesting && (harvestingIndex == index))}
                            onClick={() => { handleHarvest(item.days, index) }}
                          >
                            {`Claim reward`}
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-4 border-b pb-1 pt-1">
                            <p className="font-bold text-gray-700">
                              {`Remaining Days: `}
                            </p>
                            <span className="font-bold text-right text-blue-500">{item.remaingDays}</span>
                          </div>
                            <div className="w-full">
                              <Button
                                color={`red`}
                                fullWidth={true}
                                isBold={true}
                                isDisabled={(isHarvesting && (harvestingIndex != index))}
                                isLoading={(isHarvesting && (harvestingIndex == index))}
                                onClick={() => { handleWithdraw(item.days, index) }}
                              >
                                {`Withdraw deposit`}
                              </Button>
                            </div>
                        </>
                      )}
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-2 text-center font-bold text-gray-700">
                {`You dont have locked tokens`}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
