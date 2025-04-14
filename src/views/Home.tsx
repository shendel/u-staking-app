
import { useEffect, useState, Component } from "react"

import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import { useStorageProvider } from '@/storage/StorageProvider'
import { useStakeFactory } from '@/contexts/StakeFactoryContext'

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
    isFetchingFactory,
    isFactoryError,
    contractInfo,
    fetchFactoryInfo
  } = useStakeFactory()
console.log('>>> Home fetchFactoryInfo', fetchFactoryInfo)
  if (!appIsConfigured) {
    return (<SetupAppForm gotoPage={gotoPage} />)
  }  
  return (
    <>
      <StakingInfoBlock
        isFetchingFactory={isFetchingFactory}
        isFactoryError={isFactoryError}
        contractInfo={contractInfo}
        fetchFactoryInfo={fetchFactoryInfo}
      />
      {!injectedAccount && (
        <ConnectWalletButton />
      )}
      {injectedAccount && (
        <StakingForm
          isFactoryError={isFactoryError}
          isFetchingFactory={isFetchingFactory}
          contractInfo={contractInfo}
          fetchFactoryInfo={fetchFactoryInfo}
        />
      )}
    </>
  )
}
