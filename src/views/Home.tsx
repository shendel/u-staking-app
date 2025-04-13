
import { useEffect, useState, Component } from "react"

import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import { useStorageProvider } from '@/storage/StorageProvider'
import StakingForm from '@/components/StakingForm'
import StakingInfoBlock from '@/components/StakingInfoBlock'
import ConnectWalletButton from '@/components/ConnectWalletButton'
import SetupAppForm from '@/components/appconfig/SetupAppForm'
import fetchStakeFactory from '@/helpers_stake/fetchStakeFactory'

export default function Home(props) {
  const {
    gotoPage,
    appIsConfigured
  } = props
  
  const {
    isConnected,
    injectedAccount
  } = useInjectedWeb3()

  const {
    storageData,
    storageData: {
      uStakeChainId,
      uStakeContract
    }
  } = useStorageProvider()
  
  const [ isFetchingFactory, setIsFetchingFactory ] = useState(true)
  const [ isFactoryError, setIsFactoryError ] = useState(false)
  const [ contractInfo, setContractInfo ] = useState(false)
  useEffect(() => {
    if (uStakeChainId && uStakeContract) {
      setIsFetchingFactory(true)
      fetchStakeFactory({
        chainId: uStakeChainId,
        address: uStakeContract,
      }).then((answer) => {
        setIsFactoryError(false)
        setIsFetchingFactory(false)
        setContractInfo(answer)
      }).catch((err) => {
        setIsFetchingFactory(false)
        setIsFactoryError(true)
      })
    }
  }, [ uStakeChainId, uStakeContract ])

  if (!appIsConfigured) {
    return (<SetupAppForm gotoPage={gotoPage} />)
  }  
  return (
    <>
      <StakingInfoBlock
        isFetchingFactory={isFetchingFactory}
        isFactoryError={isFactoryError}
        contractInfo={contractInfo}
      />
      {!injectedAccount && (
        <ConnectWalletButton />
      )}
      {injectedAccount && (
        <StakingForm />
      )}
    </>
  )
}
