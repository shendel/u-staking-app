import type { AppProps } from "next/app"
import Head from 'next/head'
import getConfig from 'next/config'


import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import HashRouterViews from '@/components/HashRouterViews'

import Home from '@/views/Home'
import AppConfigInstall from '@/views/appconfig/Install'

import AppConfigSettings from '@/views/appconfig/Settings'

import Page404 from '@/pages/404'

import AppRootWrapper from '@/components/AppRootWrapper'
import Header from '@/components/Header'

import NETWORKS from '@/contstans/NETWORKS'


function MyApp(pageProps) {
  const viewsPaths = {
    '/': Home,
    '/settings': AppConfigSettings
  }

  const [ appIsConfigured, setAppIsConfigured ] = useState(false)
  
  const checkAppIsConfigured = (storageData) => {
    console.log(' checkAppIsConfigured', storageData)
    if (storageData
      && storageData.uStakeChainId
      && storageData.uStakeContract
    ) {
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
          <>
            <Header />
            <div className="container mx-auto pt-10">
              <HashRouterViews
                views={viewsPaths}
                props={{
                  appIsConfigured
                }}
                on404={Page404}
              />
            </div>
          </>
        </AppConfigInstall>
      </AppRootWrapper>
    </>
  )
}

export default MyApp;
