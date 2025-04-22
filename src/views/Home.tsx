
import { useEffect, useState, Component } from "react"

import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import { useStorageProvider } from '@/storage/StorageProvider'
import { useStakeFactory } from '@/contexts/StakeFactoryContext'

import StakingForm from '@/components/StakingForm'
import MarkDownBlock from '@/components/MarkDownBlock'

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
        homepage_topBlock,
        homepage_middleBlock,
        homepage_bottomBlock
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
      {homepage_topBlock?.enabled && (
        <div className="w-full p-6">
          <div className="bg-white rounded-lg shadow-md p-6 w-full mx-auto lg:max-w-6xl markdown-container" style={{paddingBottom: '1px'}}>
            <MarkDownBlock markdown={homepage_topBlock.content} />
          </div>
        </div>
      )}
      <StakingInfoBlock
        isFetchingFactory={isFetchingFactory}
        isFactoryError={isFactoryError}
        contractInfo={contractInfo}
        fetchFactoryInfo={fetchFactoryInfo}
      />
      {homepage_middleBlock?.enabled && (
        <div className="w-full p-6">
          <div className="bg-white rounded-lg shadow-md p-6 pb-0 w-full mx-auto lg:max-w-6xl markdown-container" style={{paddingBottom: '1px'}}>
            <MarkDownBlock markdown={homepage_middleBlock.content} />
          </div>
        </div>
      )}
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
      {homepage_bottomBlock?.enabled && (
        <div className="w-full p-6">
          <div className="bg-white rounded-lg shadow-md p-6 pb-0 w-full mx-auto lg:max-w-6xl markdown-container" style={{paddingBottom: '1px'}}>
            <MarkDownBlock markdown={homepage_bottomBlock.content} />
          </div>
        </div>
      )}
    </>
  )
}
