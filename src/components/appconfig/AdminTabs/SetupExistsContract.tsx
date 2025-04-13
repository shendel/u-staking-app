import { useState, useEffect } from 'react'

import SelectBlockchain from '@/components/appconfig/ui/SelectBlockchain'
import Button from '@/components/appconfig/ui/Button'
import Input from '@/components/appconfig/ui/Input'
import Label from '@/components/appconfig/ui/Label'
import InputBasisPoint from '@/components/appconfig/ui/InputBasisPoint'
import DepositPeriodsConfigurator from '../DepositPeriodsConfigurator'
import { useNotification } from "@/contexts/NotificationContext";
import { useConfirmationModal } from "@/components/ConfirmationModal";
import SaveToStorage from '@/components/appconfig/ui/SaveToStorage'

import fetchStakeFactory from '@/helpers_stake/fetchStakeFactory'

import { getAddressLink } from '@/helpers/etherscan'
import { fromWei } from '@/helpers/wei'

const AdminTabsSetupExistsContract = (props) => {
  const {
    onSaveContract = () => {}
  } = props

  const [ blockchainId, setBlockchainId ] = useState(0)
  const [ contractAddress, setContractAddress ] = useState(``)
  
  const [ isFetchingInfo, setIsFetchingInfo ] = useState(false)
  
  const { openModal } = useConfirmationModal();
  const { addNotification } = useNotification();

  const [ stakingTokenInfo, setStakingTokenInfo ] = useState(false)
  const [ rewardTokenInfo, setRewardTokenInfo ] = useState(false)
  
  const [ contractInfo, setContractInfo ] = useState(false)
  
  const handleFetchInfo = () => {
    setIsFetchingInfo(true)
    setContractInfo(false)
    setStakingTokenInfo(false)
    setRewardTokenInfo(false)
    
    addNotification('info', 'Fetching information from contract')
    fetchStakeFactory({
      chainId: blockchainId,
      address: contractAddress
    }).then((answer) => {
      setIsFetchingInfo(false)
      if (answer && answer.IS_ULTIMATE_STAKE_FACTORY) {
        setContractInfo(answer)
        setStakingTokenInfo(answer.stakingTokenInfo)
        setRewardTokenInfo(answer.rewardTokenInfo)
        addNotification('success', 'Staking Factory contract information successfull fetched')
      } else {
        openModal({
          isAlert: true,
          title: 'Error',
          okTitle: 'Ok',
          description: 'This is not Ultimate Staking Factory contract'
        })
      }
      console.log('>>> answer', answer)
    }).catch((err) => {
      setIsFetchingInfo(false)
      addNotification('error', 'Fail fetch Stake Factory info')
      console.log('>>> err', err)
    })
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h4 className="text-2xl font-bold mt-4 mb-4">Setup an exists staking contract</h4>
      <Label>{`1. Select the blockchain where the contract is located`}</Label>
      <SelectBlockchain value={blockchainId} onChange={setBlockchainId} />
      <Label>{`2. Put contract address`}</Label>
      <Input
        value={contractAddress}
        setValue={setContractAddress}
        buttons={(
          <>
            <Button isLoading={isFetchingInfo} onClick={handleFetchInfo}>{`Fetch info`}</Button>
          </>
        )}
      />
      {contractInfo && (
        <>
          <Label>{`Contract owner`}</Label>
          <Input value={contractInfo.owner} disabled={true} hasLink={getAddressLink(blockchainId, contractInfo.owner)} />
          <Label>{`Staking token`}</Label>
          <Input value={stakingTokenInfo.addr} disabled={true} hasLink={getAddressLink(blockchainId, stakingTokenInfo.addr)} />
          <div className="p-2 bg-gray-100 rounded">
            <p>
              <strong>Symbol:</strong> {stakingTokenInfo.symbol}
            </p>
            <p>
              <strong>Name:</strong> {stakingTokenInfo.name}
            </p>
            <p>
              <strong>Decimals:</strong> {stakingTokenInfo.decimals}
            </p>
            <p>
              <strong>Balance at contract:</strong> {fromWei(stakingTokenInfo.balance, stakingTokenInfo.decimals)} {stakingTokenInfo.symbol}
            </p>
          </div>
          <Label>{`Reward token`}</Label>
          <Input value={rewardTokenInfo.addr} disabled={true} hasLink={getAddressLink(blockchainId, rewardTokenInfo.addr)} />
          <div className="p-2 bg-gray-100 rounded">
            <p>
              <strong>Symbol:</strong> {rewardTokenInfo.symbol}
            </p>
            <p>
              <strong>Name:</strong> {rewardTokenInfo.name}
            </p>
            <p>
              <strong>Decimals:</strong> {rewardTokenInfo.decimals}
            </p>
            <p>
              <strong>Balance at contract:</strong> {fromWei(rewardTokenInfo.balance, rewardTokenInfo.decimals)} {rewardTokenInfo.symbol}
            </p>
          </div>
          <Label>{`Tax reciever:`}</Label>
          <Input value={contractInfo.taxReceiver} disabled={true} hasLink={getAddressLink(blockchainId, contractInfo.taxReceiver)} />
          <InputBasisPoint 
            label={`Deduction Percentage (Basis Points):`}
            disabled={true}
            isEditable={true}
            value={contractInfo.deductionPercentage}
          />
          <Label>{`Deposit Periods:`}</Label>
          <DepositPeriodsConfigurator
            isReadOnly={true}
            lockPeriods={contractInfo.lockPeriodsInfo}
          />
          <SaveToStorage onClick={() => {
            onSaveContract({
              stakingChainId: contractInfo.chainId,
              stakingContract: contractInfo.address,
            })
          }}>
            {`Use this contract. Save this contract to app configuration`}
          </SaveToStorage>
        </>
      )}
    </div>
  )
}


export default AdminTabsSetupExistsContract