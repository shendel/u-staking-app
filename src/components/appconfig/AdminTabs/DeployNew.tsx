import React, { useState, useEffect } from "react";
import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import DepositPeriodsConfigurator from '../DepositPeriodsConfigurator'
import NETWORKS from '@/constants/NETWORKS'
import isEvmAddress from '@/helpers/isEvmAddress'
import fetchTokenInfo from '@/helpers/fetchTokenInfo'
import { useNotification } from "@/contexts/NotificationContext";
import { useConfirmationModal } from "@/components/ConfirmationModal";
import SelectBlockchain from '@/components/appconfig/ui/SelectBlockchain'
import Input from '@/components/appconfig/ui/Input'
import Label from '@/components/appconfig/ui/Label'
import InputBasisPoint from '@/components/appconfig/ui/InputBasisPoint'
import Button from '@/components/appconfig/ui/Button'
import SaveToStorage from '@/components/appconfig/ui/SaveToStorage'
import ErrorField from '@/components/appconfig/ui/ErrorField'
import { GET_CHAIN_BYID } from '@/web3/chains'
import deployStakeFactory from '@/helpers_stake/deployStakeFactory'

import {
  getTransactionLink,
  getAddressLink,
  getShortAddress,
  getShortTxHash
} from '@/helpers/etherscan'

const AdminTabsDeployNew = (props) => {
  const {
    onSettingsChanged = () => {},
    onSaveContract = () => {}
  } = props

  const {
    injectedWeb3,
    injectedAccount,
    injectedChainId,
    switchNetwork,
  } = useInjectedWeb3()

  const { openModal } = useConfirmationModal();
  const { addNotification } = useNotification();
  
  
  const [ deployChainId, setDeployChainId ] = useState(injectedChainId)
  const [ stakingToken, setStakingToken ] = useState("");
  const [ rewardToken, setRewardToken ] = useState("");

  
  const handleChangeDeployChainId = async (chainId) => {
    if (chainId) {
      if (chainId != deployChainId) {
        setStakingTokenInfo(false)
        setRewardTokenInfo(false)
      }
      console.log('>>>', chainId)
      try {
        await switchNetwork(chainId)
        setDeployChainId(chainId)
      } catch (err) {
        console.log('fail change chain')
      }
    }
  }
  // Состояния для информации о токенах
  const [stakingTokenInfo, setStakingTokenInfo] = useState({});
  const [rewardTokenInfo, setRewardTokenInfo] = useState({});
  const [taxReciever, setTaxReciever] = useState(injectedAccount)
  const [deductionPercentage, setDeductionPercentage ] = useState(0)

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

  const [ isFetchingStakingToken, setIsFetchingStakingToken ] = useState(false)
  const handleRequestStakingTokenInfo = async () => {
    console.log('>>> handleRequestStakingTokenInfo', stakingToken, deployChainId)
    if (isFetchingStakingToken) return
    setStakingTokenInfo(false)
    if (isEvmAddress(stakingToken)) {
      setIsFetchingStakingToken(true)
      fetchTokenInfo(stakingToken, deployChainId).then((info) => {
        setIsFetchingStakingToken(false)
        addNotification('success', 'Staking token info fetched')
        setStakingTokenInfo(info)
        console.log(info)
      }).catch((err) => {
        setIsFetchingStakingToken(false)
        addNotification('error', 'Fail fetch staking token info')
        console.log('>>> Fail fetch staking token info', err)
      })
    } else {
      addNotification('error', 'Address not EVM')
    }
  };

  const [ isFetchingRewardToken, setIsFetchingRewardToken ] = useState(false)
  
  const handleRequestRewardTokenInfo = async () => {
    if (isFetchingRewardToken) return
    setRewardTokenInfo(false)
    if (isEvmAddress(rewardToken)) {
      setIsFetchingRewardToken(true)
      fetchTokenInfo(rewardToken, deployChainId).then((info) => {
        setIsFetchingRewardToken(false)
        addNotification('success', 'Raward token info fetched')
        setRewardTokenInfo(info)
        console.log(info)
      }).catch((err) => {
        setIsFetchingRewardToken(false)
        addNotification('error', 'Fail fetch reward token info')
        console.log('>>> Fail fetch reward token info', err)
      })
    } else {
      addNotification('error', 'Address not EVM')
    }
  };

  const [ isDeploying, setIsDeploying ] = useState(false)
  const [ deployedContract, setDeployedContract ] = useState(false)
  
  const handleDeployContract = () => {
    openModal({
      desciption: 'Deploy contract with this params?',
      onConfirm: () => {
        setIsDeploying(true)
        addNotification('info', 'Deploying Stake contract. Confirm tx')
        deployStakeFactory({
          activeWeb3: injectedWeb3,
          stakingTokenInfo,
          rewardTokenInfo,
          taxReciever,
          deductionPercentage,
          lockPeriods,
          onTrx: (txHash) => {
            addNotification(
              'success',
              'Deploy transaction',
              getTransactionLink(deployChainId, txHash),
              getShortTxHash(txHash)
            )
          },
          onSuccess: (contractAddress) => {
            addNotification(
              'success',
              'Contract deployed',
              getAddressLink(deployChainId, contractAddress),
              getShortAddress(contractAddress)
            )
            setDeployedContract(contractAddress)
            setIsDeploying(false)
          },
          onError: (err) => {
            addNotification('error', 'Fail deploy contract')
            setIsDeploying(false)
            console.log('>>> err', err)
          },
          onFinally: (info) => {
            console.log('>>> onFinally', info)
          },
        })
      }
    })
  };

  
  const [ deployErrors, setDeployErrors ] = useState(false)
  const checkDeployErrors = () => {
    const newErrors = []
    if (!stakingToken || !isEvmAddress(stakingToken) || !stakingTokenInfo) {
      newErrors.push(`Staking token not valid, or info about it not fetched`)
    }
    if (!rewardToken || !isEvmAddress(rewardToken) || !rewardTokenInfo) {
      newErrors.push(`Reward token not valid, or info about it not fetched`)
    }
    if (!taxReciever || !isEvmAddress(taxReciever)) {
      newErrors.push(`Tax reciever not valid EVM address`)
    }
    if (lockPeriods.length == 0) {
      newErrors.push(`You dont configure lock piriods`)
    }
    if (lockPeriodsEditable.length > 0) {
      newErrors.push(`You have not confirmed periods at edit state`)
    }
    console.log('>>> Deploy errors', newErrors)
    setDeployErrors(newErrors)
  }
  useEffect(() => {
    checkDeployErrors()
  }, [
    stakingToken,
    stakingTokenInfo,
    rewardToken,
    rewardTokenInfo,
    taxReciever,
    lockPeriods,
    lockPeriodsEditable
  ])

  return (
    <div className="w-full max-w-4xl mx-auto">
      {!deployedContract && (
        <>
          <h4 className="text-2xl font-bold mt-4 mb-4">Base contract settings</h4>
          {/* Выбор целевого блокчейна */}
          <div className="mb-2">
            <Label>{`1. Select Target Blockchain:`}</Label>
            <SelectBlockchain value={deployChainId} onChange={(e) => handleChangeDeployChainId(e.target.value)} />
          </div>

          {/* Параметры стейкинга */}
          <div>
            {/* Токен для стейкинга */}
            <div className="mb-2">
              <Label>{`2. Staking Token Address:`}</Label>
              <Input
                value={stakingToken}
                setValue={(v) => {
                  setStakingToken(v)
                }}
                disabled={isFetchingStakingToken}
                buttons={(
                  <Button
                    onClick={handleRequestStakingTokenInfo}
                    isLoading={isFetchingStakingToken}
                  >
                    Fetch Token Info
                  </Button>
                )}
              />
              {/* Информация о токене для стейкинга */}
              {Object.keys(stakingTokenInfo).length > 0 && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                  <p>
                    <strong>Symbol:</strong> {stakingTokenInfo.symbol}
                  </p>
                  <p>
                    <strong>Name:</strong> {stakingTokenInfo.name}
                  </p>
                  <p>
                    <strong>Decimals:</strong> {stakingTokenInfo.decimals}
                  </p>
                </div>
              )}
            </div>
            {/* Токен награды */}
            <div className="mb-2">
              <Label>{`3. Reward Token Address:`}</Label>
              <Input
                value={rewardToken}
                setValue={(v) => {
                  setRewardToken(v)
                }}
                disabled={isFetchingRewardToken}
                buttons={(
                  <Button
                    onClick={handleRequestRewardTokenInfo}
                    isLoading={isFetchingRewardToken}
                  >
                    Fetch Token Info
                  </Button>
                )}
              />
              {/* Информация о токене награды */}
              {Object.keys(rewardTokenInfo).length > 0 && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                  <p>
                    <strong>Symbol:</strong> {rewardTokenInfo.symbol}
                  </p>
                  <p>
                    <strong>Name:</strong> {rewardTokenInfo.name}
                  </p>
                  <p>
                    <strong>Decimals:</strong> {rewardTokenInfo.decimals}
                  </p>
                </div>
              )}
            </div>
            {/* Tax Reciever */}
            <div className="mb-2">
              <Label>{`4. Tax reciever:`}</Label>
              <Input
                value={taxReciever}
                setValue={(v) => setTaxReciever(v)}
              />
            </div>
            <InputBasisPoint
              label={`5. Deduction Percentage (Basis Points):`}
              value={deductionPercentage}
              tooltip={`Some tooltip`}
              isEditable={true}
              setValue={(v) => setDeductionPercentage(v)}
            />
            <h4 className="text-2xl font-bold mt-4 mb-4">Deposit Periods Configurator</h4>
            <DepositPeriodsConfigurator
              isContractEdit={false}
              onPeriodsUpdated={handlePeriodsUpdate}
              lockPeriods={lockPeriods}
              onPeriodEdit={onPeriodEdit}
            />
            {deployErrors.length > 0 && (
              <ErrorField>
                <>
                  <p>Cant deploy:</p>
                  {deployErrors.map((error, key) => {
                    return (<p key={key}>{error}</p>)
                  })}
                </>
              </ErrorField>
            )}
            {/* Большая кнопка деплоя контракта */}
          
            <Button
              fullWidth={true}
              color={`green`}
              isLoading={isDeploying}
              isDisabled={(deployErrors.length > 0)}
              onClick={handleDeployContract}
            >
              Deploy Staking Contract
            </Button>
          </div>
        </>
      )}
      {deployedContract && (
        <>
          <h4 className="text-2xl font-bold mt-4 mb-4">Staking contract ready</h4>
          <div className="mb-2">
            <Label>{`Staking blockchain:`}</Label>
            <Input value={`${GET_CHAIN_BYID(deployChainId).name} (${deployChainId})`} disabled={true} />
          </div>
          <div className="mb-2">
            <Label>{`Deployed contract address:`}</Label>
            <Input value={deployedContract} disabled={true} hasLink={getAddressLink(deployChainId, deployedContract)} />
          </div>
          <div className="mb-2">
            <SaveToStorage onClick={() => {
              onSaveContract({
                stakingChainId: deployChainId,
                stakingContract: deployedContract
              })
            }}>
              {`Save this contract to app configuration`}
            </SaveToStorage>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminTabsDeployNew;