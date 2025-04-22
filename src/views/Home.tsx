
import { useEffect, useState, Component } from "react"

import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import { useStorageProvider } from '@/storage/StorageProvider'
import { useStakeFactory } from '@/contexts/StakeFactoryContext'

import StakingForm from '@/components/StakingForm'
import StakingInfoBlock from '@/components/StakingInfoBlock'
import ConnectWalletButton from '@/components/ConnectWalletButton'
import SetupAppForm from '@/components/appconfig/SetupAppForm'
import fetchStakeFactory from '@/helpers_stake/fetchStakeFactory'
import Head from "next/head";

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
    storageData: {
      exdata: {
        whitelabel,
      }
    }
  } = useStorageProvider()
  
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
      <Head>
        <title>{whitelabel.siteTitle.replace('[PAGE_TITLE]', 'Home')}</title>
      </Head>
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
