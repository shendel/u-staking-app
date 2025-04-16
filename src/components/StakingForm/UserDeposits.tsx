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
import UserDepositItem from './UserDepositItem'
import { AnimatePresence, motion } from "framer-motion";

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
    injectedChainId,
    switchNetwork,
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
  const [ harvestingId, setHarvestiongId ] = useState(0)
  
  const handleHarvest = (day, id, isClaim = true) => {
    setHarvestiongId(id)
    setIsHarvesting(true)
    addNotification('info', (isClaim) ? 'Claiming reward. Confirm transaction' : 'Withdrawing deposit. Confirm transaction')
    harvestTokens({
      activeWeb3: injectedWeb3,
      stakeFactoryAddress: factoryAddress,
      locksIndexes: [ id ],
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
        const newLocks = userLocks.filter(({ id: lockId }) => { return lockId != id })
        setUserLocks([...newLocks])
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
  
  const handleWithdraw = (day, id) => {
    openModal({
      description: (
        <>
          <div>
            {`Do you really want to close this deposit before the unlock time?`}
          </div>
          {(contractInfo.deductionPercentage != "0") && (
            <div>
               {`In this case, you will have to pay a penalty of `}
               <span className="font-bold text-red-700">
                {contractInfo.deductionPercentage / 100}{`%`}
               </span>
               {` of the deposit amount`}
            </div>
          )}
        </>
      ),
      onConfirm: () => {
        handleHarvest(day, id, false)
      }
    })
    // Do you really want to close this deposit before the unlock time? In this case, you will have to pay a penalty of 20% of the deposit amount
  }
  return (
    <div>
      {/* Список стейкинговых периодов */}
      <div>
        <span className="block text-gray-700 font-bold mb-2 text-center text-xl ">
          You Deposits
        </span>
        {(isFetchingPeriods && userLocks.length == 0) ? (
          <LoadingPlaceholder height={128}/>
        ) : (
          <>
            {userLocks.length > 0 ? (
              <AnimatePresence>
                <motion.ul
                  initial={{ opacity: 0 }} // Начальное состояние (видимый блок)
                  animate={{ opacity: 1, transition: { duration: 0.5 } }}
                >
                  <AnimatePresence>
                  {userLocks.map((item, index) => {
                    return (
                      <UserDepositItem
                        key={item.id}
                        {...item}
                        stakingTokenInfo={stakingTokenInfo}
                        rewardTokenInfo={rewardTokenInfo}
                        isHarvesting={isHarvesting}
                        harvestingId={harvestingId}
                        handleHarvest={handleHarvest}
                        handleWithdraw={handleWithdraw}
                        needSwithChain={(injectedChainId != chainId)}
                        switchNetwork={switchNetwork}
                        chainId={chainId}
                        getApy={getApy}
                      />
                    )
                  })}
                  </AnimatePresence>
                </motion.ul>
              </AnimatePresence>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.5 } }}
                  className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-2 text-center font-bold text-gray-700"
                >
                  {`You dont have locked tokens`}
                </motion.div>
              </AnimatePresence>
            )}
          </>
        )}
      </div>
    </div>
  )
}
