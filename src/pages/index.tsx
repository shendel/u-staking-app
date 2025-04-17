import type { AppProps } from "next/app"
import Head from 'next/head'
import getConfig from 'next/config'


import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import AppConfigInstall from '@/views/appconfig/Install'
import AppRootWrapper from '@/components/AppRootWrapper'
import StakeFactoryProvider from '@/contexts/StakeFactoryContext'
import MyStakeApp from './_index'

function MyApp(pageProps) {
  const [ appIsConfigured, setAppIsConfigured ] = useState(false)
  const [ uStakeChainId, setUStakeChainId ] = useState(false)
  const [ uStakeContract, setUStakeContract ] = useState(false)
  
  const checkAppIsConfigured = (storageData) => {
    console.log(' checkAppIsConfigured', storageData)
    if (storageData
      && storageData.uStakeChainId
      && storageData.uStakeContract
    ) {
      setUStakeChainId(storageData.uStakeChainId)
      setUStakeContract(storageData.uStakeContract)
      setAppIsConfigured(true)
      return storageData.uStakeChainId
    } else {
      console.log('>>> Need setup')
      return false
    }
  }
  
  return (
    <>
      <AppRootWrapper checkAppIsConfigured={checkAppIsConfigured}>
        <AppConfigInstall>
          <StakeFactoryProvider chainId={uStakeChainId} contractAddress={uStakeContract}>
            <MyStakeApp appIsConfigured={appIsConfigured} />
          </StakeFactoryProvider>
        </AppConfigInstall>
      </AppRootWrapper>
    </>
  )
}

export default MyApp;
