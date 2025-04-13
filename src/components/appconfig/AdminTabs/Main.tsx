import { useState, useEffect } from 'react'

import { GET_CHAIN_BYID } from '@/web3/chains'
import Label from '@/components/appconfig/ui/Label'
import Input from '@/components/appconfig/ui/Input'
import Button from '@/components/appconfig/ui/Button'
import InputBasisPoint from '@/components/appconfig/ui/InputBasisPoint'
import DepositPeriodsConfigurator from '../DepositPeriodsConfigurator'
import callStakeFactoryMethod from '@/helpers_stake/callStakeFactoryMethod'
import fetchStakeFactory from '@/helpers_stake/fetchStakeFactory'
import { fromWei, toWei } from '@/helpers/wei'
import { useNotification } from "@/contexts/NotificationContext";
import { useConfirmationModal } from "@/components/ConfirmationModal";
import {
  getAddressLink,
  getTransactionLink,
  getShortTxHash
} from '@/helpers/etherscan'
import { useStorageProvider } from '@/storage/StorageProvider'
import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'

const AdminTabsMain = (props) => {

  const {
    storageData,
    storageIsLoading,
    storageData: {
      uStakeChainId,
      uStakeContract
    }
  } = useStorageProvider()

  const {
    injectedWeb3,
    injectedAccount
  } = useInjectedWeb3()

  const { openModal } = useConfirmationModal();
  const { addNotification } = useNotification();
  
  const stakingChainInfo = GET_CHAIN_BYID(uStakeChainId)

  const [ isFetchingInfo, setIsFetchingInfo ] = useState(false)
  const [ contractInfo, setContractInfo ] = useState(false)
  const [ stakingTokenInfo, setStakingTokenInfo ] = useState(false)
  const [ rewardTokenInfo, setRewardTokenInfo ] = useState(false)
  
  const [ taxReciever, setTaxReciever ] = useState("")
  const [ taxRecieverEdit, setTaxRecieverEdit ] = useState(false)
  const [ taxRecieverSaving, setTaxRecieverSaving ] = useState(false)

  const [ deductionPercentage, setDeductionPercentage ] = useState(0)
  const [ deductionPercentageEdit, setDeductionPercentageEdit ] = useState(false)
  const [ deductionPercentageSaving, setDeductionPercentageSaving ] = useState(false)

  const [ lockPeriods, setLockPeriods ] = useState([])
  const [ lockPeriodsEditable, setLockPeriodsEditable ] = useState([])
  
  const handlePeriodsUpdate = (newPeriods) => {
    console.log('>>> newPeriods', newPeriods)
    setLockPeriods(newPeriods)
  }
  const onPeriodEdit = (isEditableArray) => {
    setLockPeriodsEditable(isEditableArray)
    console.log('>>> ON PERIODS EDIT', isEditableArray)
  }
  const _fetchContractInfo = () => {
    addNotification('info', 'Fetching contract info')
    setContractInfo(false)
    setStakingTokenInfo(false)
    setRewardTokenInfo(false)
    setLockPeriods([])
    setLockPeriodsEditable([])
    fetchStakeFactory({
      chainId: uStakeChainId,
      address: uStakeContract
    }).then((answer) => {
      setIsFetchingInfo(false)
      if (answer && answer.IS_ULTIMATE_STAKE_FACTORY) {
        setContractInfo(answer)
        const {
          stakingTokenInfo,
          rewardTokenInfo,
          deductionPercentage,
          taxReceiver,
          lockPeriodsInfo,
        } = answer
        setStakingTokenInfo(stakingTokenInfo)
        setRewardTokenInfo(rewardTokenInfo)
        setTaxReciever(taxReceiver)
        setLockPeriods(lockPeriodsInfo)
        setLockPeriodsEditable([])
        setDeductionPercentage(deductionPercentage)
        addNotification('success', 'Staking Factory contract information successfull fetched')
      } else {
        addNotification('fail', 'Contract in app configuration is not Ultimate Staking Factory')
      }
    }).catch((err) => {
      setIsFetchingInfo(false)
      addNotification('error', 'Fail fetch Stake Factory info')
    })
  }
  deductionPercentage
  
  useEffect(() => {
    if (uStakeChainId && uStakeContract) {
      _fetchContractInfo()
    }
  }, [ uStakeChainId, uStakeContract ])
  
  // Update tax reciever
  const handleUpdateTaxReciever = () => {
    openModal({
      description: 'Do you want update tax reciever at contract?',
      onConfirm: async () => {
        try {
          addNotification('info', 'Updating Tax Receiver. Confirm transaction')
          setTaxRecieverSaving(true)
          await callStakeFactoryMethod({
            activeWeb3: injectedWeb3,
            contractAddress: contractInfo.address,
            method: 'setTaxReceiver',
            args: [ taxReciever ],
            onTrx: (txHash) => {
              console.log('>>> onTrx', txHash)
              addNotification(
                'success',
                'Update Tax Receiver transaction',
                getTransactionLink(contractInfo.chainId, txHash),
                getShortTxHash(txHash)
              )
            },
            onSuccess: (res) => {
              console.log('>>> onSuccess', res)
              addNotification('success', 'Tax receiver updated')
              setTaxRecieverSaving(false)
              setTaxRecieverEdit(false)
              setContractInfo({
                ...contractInfo,
                taxReceiver: taxReciever,
              })
            },
            onError: (err) => {
              addNotification('error', 'Fail update Tax Receiver')
              setTaxRecieverSaving(false)
              console.log('>>> onError', err)
            },
            onFinally: (res) => {
              console.log('>>> onFinally', res)
            }
          })
        } catch (err) {}
      }
    })
  }
  // Update deductionPercentage
  const handleUpdateDeductionPercentage = () => {
    openModal({
      description: 'Do you want update deduction percentage at contract?',
      onConfirm: async () => {
        try {
          addNotification('info', 'Updating deduction percentage. Confirm transaction')
          setDeductionPercentageSaving(true)
          await callStakeFactoryMethod({
            activeWeb3: injectedWeb3,
            contractAddress: contractInfo.address,
            method: 'setDeductionPercentage',
            args: [ deductionPercentage ],
            onTrx: (txHash) => {
              console.log('>>> onTrx', txHash)
              addNotification(
                'success',
                'Update deduction percentage transaction',
                getTransactionLink(contractInfo.chainId, txHash),
                getShortTxHash(txHash)
              )
            },
            onSuccess: (res) => {
              console.log('>>> onSuccess', res)
              setContractInfo({
                ...contractInfo,
                deductionPercentage: deductionPercentage
              })
              setDeductionPercentageEdit(false)
              setDeductionPercentageSaving(false)
              addNotification('success', 'Deduction percentage updated')
            },
            onError: (err) => {
              addNotification('error', 'Fail update deduction percentage')
              setDeductionPercentageSaving(false)
              console.log('>>> onError', err)
            },
            onFinally: (res) => {
              console.log('>>> onFinally', res)
            }
          })
        } catch (err) {}
      }
    })
  }
  // Удаление периода
  const handlePeriodDelete = (periodData) => {
    return new Promise(async (resolve, reject) => {
      addNotification('info', `Removing Lock Period (${periodData.lockTimeDays} days). Confirm transaction`)
      try {
        await callStakeFactoryMethod({
          activeWeb3: injectedWeb3,
          contractAddress: contractInfo.address,
          method: 'removeLockPeriod',
          args: [ periodData.lockTimeDays ],
          onTrx: (txHash) => {
            console.log('>>> onTrx', txHash)
            addNotification(
              'success',
              'Remove Lock Period transaction',
              getTransactionLink(contractInfo.chainId, txHash),
              getShortTxHash(txHash)
            )
          },
          onSuccess: (res) => {
            console.log('>>> onSuccess', res)
            resolve(true)
          },
          onError: (err) => {
            reject()
            console.log('>>> onError', err)
          },
          onFinally: (res) => {
            console.log('>>> onFinally', res)
          }
        })
      } catch (err) {}
    })
  }
  // Сохранение информации о периоде в контракте / добавление нового периода
  const handlePeriodChanged = (periodData) => {
    return new Promise(async (resolve, reject) => {
      /*
        Solidity
          function setAllocation(
              uint256 _days,
              uint256 _minimumDeposit,
              uint256 percentageBasisPoints,
              uint256 _maxRate,
              uint256 _minRate,
              uint256 _decrementStep,
              uint256 _stepSize,
              bool    _fixedBasisPoints
          )
      */
      const saveData = [
        periodData.lockTimeDays,
        toWei(periodData.minimumDeposit, stakingTokenInfo.decimals),
        periodData.percentageBasisPoints,
        periodData.maxRate,
        periodData.minRate,
        periodData.decrementStep,
        toWei(periodData.stepSize, stakingTokenInfo.decimals),
        (periodData.fixedBasisPoints) ? 1 : 0
      ]
      console.log('>>> saveData', saveData)
      addNotification('info', `Updating Lock Period (${periodData.lockTimeDays} days). Confirm transaction`)
      try {
        await callStakeFactoryMethod({
          activeWeb3: injectedWeb3,
          contractAddress: contractInfo.address,
          method: 'setAllocation',
          args: saveData,
          onTrx: (txHash) => {
            console.log('>>> onTrx', txHash)
            addNotification(
              'success',
              'Update Lock Period transaction',
              getTransactionLink(contractInfo.chainId, txHash),
              getShortTxHash(txHash)
            )
          },
          onSuccess: (res) => {
            console.log('>>> onSuccess', res)
            resolve(true)
          },
          onError: (err) => {
            reject()
            console.log('>>> onError', err)
          },
          onFinally: (res) => {
            console.log('>>> onFinally', res)
          }
        })
      } catch (err) {}
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h4 className="text-2xl font-bold mt-4 mb-4">Staking contract information</h4>
      {/* ----------------------------------------- */}
      <Label>{`Blockchain:`}</Label>
      <Input value={`${stakingChainInfo.name} (${uStakeChainId})`} disabled={true} />
      {/* ----------------------------------------- */}
      <Label>{`Contract:`}</Label>
      <Input value={uStakeContract} disabled={true} hasLink={getAddressLink(uStakeChainId, uStakeContract)}/>
      {/* ----------------------------------------- */}
      {contractInfo && (
        <>
          <Label>{`Contract owner`}</Label>
          <Input value={contractInfo.owner} disabled={true} hasLink={getAddressLink(uStakeChainId, contractInfo.owner)} />
          {/* ----------------------------------------- */}
          <Label>{`Staking token`}</Label>
          <Input value={stakingTokenInfo.addr} disabled={true} hasLink={getAddressLink(uStakeChainId, stakingTokenInfo.addr)} />
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
          {/* ----------------------------------------- */}
          <Label>{`Reward token`}</Label>
          <Input value={rewardTokenInfo.addr} disabled={true} hasLink={getAddressLink(uStakeChainId, rewardTokenInfo.addr)} />
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
          {/* ----------------------------------------- */}
          <Label>{`Tax reciever:`}</Label>
          <Input
            value={taxReciever}
            hasLink={!taxRecieverEdit && getAddressLink(uStakeChainId, taxReciever)}
            setValue={(v) => setTaxReciever(v)}
            disabled={!taxRecieverEdit || taxRecieverSaving}
            buttons={(
              <>
                {!taxRecieverEdit ? (
                  <Button onClick={() => { setTaxRecieverEdit(true) }}>
                    {`Change`}
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleUpdateTaxReciever}
                      isLoading={taxRecieverSaving}
                      color={`green`}
                    >
                      {`Save`}
                    </Button>
                    <Button
                      color={`red`}
                      isDisabled={taxRecieverSaving}
                      onClick={() => {
                        setTaxReciever(contractInfo.taxReceiver)
                        setTaxRecieverEdit(false)
                      }}
                    >
                      {`Cancel`}
                    </Button>
                  </>
                )}
              </>
            )}
          />
          {/* ----------------------------------------- */}
          <InputBasisPoint
            label={`Deduction Percentage (Basis Points):`}
            value={deductionPercentage}
            tooltip={`Some tooltip`}
            isEditable={true}
            disabled={!deductionPercentageEdit || deductionPercentageSaving}
            setValue={(v) => setDeductionPercentage(v)}
            buttons={(
              <>
                {!deductionPercentageEdit ? (
                  <Button onClick={() => { setDeductionPercentageEdit(true) }}>
                    {`Change`}
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleUpdateDeductionPercentage}
                      isLoading={deductionPercentageSaving}
                      color={`green`}
                    >
                      {`Save`}
                    </Button>
                    <Button
                      color={`red`}
                      isDisabled={deductionPercentageSaving}
                      onClick={() => {
                        setDeductionPercentage(contractInfo.deductionPercentage)
                        setDeductionPercentageEdit(false)
                      }}
                    >
                      {`Cancel`}
                    </Button>
                  </>
                )}
              </>
            )}
          />
          {/* ----------------------------------------- */}
          <h4 className="text-2xl font-bold mt-4 mb-4">Deposit Periods Configurator</h4>
          <DepositPeriodsConfigurator
            isContractEdit={true}
            onPeriodsUpdated={handlePeriodsUpdate}
            lockPeriods={lockPeriods}
            onPeriodEdit={onPeriodEdit}
            onPeriodChange={handlePeriodChanged}
            onPeriodDelete={handlePeriodDelete}
          />
        </>
      )}
    </div>
  )
}

export default AdminTabsMain