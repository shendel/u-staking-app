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
import BigNumber from "bignumber.js";
import { GET_CHAIN_BYID } from '@/web3/chains'


const StakingFormClaimReward = (props) => {
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
    injectedChainId,
    injectedWeb3,
    switchNetwork,
  } = useInjectedWeb3()

  const { openModal } = useConfirmationModal();
  const { addNotification } = useNotification();
  
  const [ isFetchingPeriods, setIsFetchingPeriods ] = useState(false)
  const [ lockedAmount, setLockedAmount ] = useState(0)
  const [ pendingReward, setPendingReward ] = useState(0)
  const [ readyLocks, setReadyLocks ] = useState([])
  
  window.test = () => {
    const depositeToken = [ 10, 20, 30, 40, 50]
    const _index = [3,1,0]
    for (let t = 0; t < _index.length; t++) {
      //if (_index[t] < (depositeToken.length - 1)) {
      console.log('>>> ', t, _index[t])
        for (let i = _index[t]; i < depositeToken.length - 1; i++) {
          console.log('> shift >', i , depositeToken[i], depositeToken[i + 1])
          depositeToken[i] = depositeToken[i + 1];
        }
      //}
      depositeToken.pop();
    }
    console.log('>>> depositeToken', depositeToken)
  }
  const doFetchUsersPeriods = () => {
    setIsFetchingPeriods(true)
    fetchUserDeposits({
      factoryAddress,
      chainId,
      userAddress: injectedAccount
    }).then((answer) => {
      setIsFetchingPeriods(false)
      console.log('>>> answer', answer)
      const {
        periods,
        pendingReward
      } = answer
      setPendingReward(pendingReward)
      const readyLocks = periods.filter(({ canClaim }) => ( canClaim ))
      let lockedAmount = new BigNumber(0)
      readyLocks.forEach(({ amount }) => {
        lockedAmount = lockedAmount.plus(amount)
      })
      setReadyLocks(readyLocks)
      setLockedAmount(lockedAmount.toFixed())
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
  const handleClaim = () => {
    addNotification('info', 'Claiming reward. Confirm transaction')
    setIsHarvesting(true)
    harvestTokens({
      activeWeb3: injectedWeb3,
      stakeFactoryAddress: factoryAddress,
      locksIndexes: readyLocks.map(({ id }) => { return id }),
      onTrx: (txHash) => {
        addNotification('info',
          `Claiming transaction`,
          getTransactionLink(chainId, txHash),
          getShortTxHash(txHash)
        )
      },
      onSuccess: () => {
        setIsHarvesting(false)
        setReadyLocks([])
        addNotification('success', 'Successfull claimed')
      },
      onError: () => {
        setIsHarvesting(false)
        addNotification('error', 'Claim is failed')
      },
    }).catch((err) => {})
  }

  return (
    <div>
      <div className="block text-gray-700 font-bold mb-2 text-center text-xl">
        {(isFetchingPeriods) ? `Loading...` : `Claim your rewards`}
      </div>
      {isFetchingPeriods ? (
        <LoadingPlaceholder height="128px" />
      ) : (
        <>
          {readyLocks.length > 0 ? (
            <>
              <div className="bg-gray-100 p-4 rounded mb-4">
                <h3 className="text-lg font-bold mb-2 text-gray-700">Reward details</h3>
                <div className="font-bold text-gray-700">
                  <div className="grid grid-cols-2 gap-4 border-b border-gray-300 pb-1">
                    <span>{`Count ready to unlock`}</span>
                    <span className="text-green-700 text-right">{readyLocks.length}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b border-gray-300 pt-1 pb-1">
                    <span>{`Locked amount`}</span>
                    <span className="text-green-700 text-right">
                      {fromWei(lockedAmount, stakingTokenInfo.decimals)}
                      {` `}
                      {stakingTokenInfo.symbol}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b border-gray-300 pt-1 pb-1">
                    <span>{`You reward`}</span>
                    <span className="text-green-700 text-right">
                      {fromWei(pendingReward, rewardTokenInfo.decimals)}
                      {` `}
                      {rewardTokenInfo.symbol}
                    </span>
                  </div>
                </div>
              </div>
              {injectedChainId != chainId ? (
                <Button isBold={true} fullWidth={true} onClick={() => { switchNetwork(chainId) }}>
                  {`Switch to "${GET_CHAIN_BYID(chainId).name}"`}
                </Button>
              ) : (
                <Button color={`green`} fullWidth={true} isBold={true} isLoading={isHarvesting} onClick={handleClaim}>
                  {`Unlock deposits and Claim reward`}
                </Button>
              )}
            </>
          ) : (
            <div
              className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-2 text-center font-bold text-gray-700"
            >
              {`No deposits available to unlock`}
            </div>
          )}
        </>
      )}
    </div>
  )
}


export default StakingFormClaimReward