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
import Footer from '@/components/Footer'

import NETWORKS from '@/contstans/NETWORKS'

import StakeFactoryProvider from '@/contexts/StakeFactoryContext'
import { useStorageProvider } from '@/storage/StorageProvider'
import MarkDownViewer from '@/views/MarkDownViewer'

function MyStakeApp(pageProps) {
  const {
    appIsConfigured
  } = pageProps
  //const testPage = MarkDownViewer('./about.md')
  const viewsPaths = {
    '/': Home,
    '/settings': AppConfigSettings
  }

  const {
    storageData,
    storageIsLoading,
  } = useStorageProvider()
  const [ appIsLoaded, setAppIsLoaded ] = useState(false)
  const [ mdRouters, setMdRouters ] = useState({})
  
  useEffect(() => {
    if (storageData && !storageIsLoading) {
      if (storageData.mdRouters) {
        const newMdRouters = {}
        storageData.mdRouters.forEach(({ hash, url }) => {
          newMdRouters[hash] = MarkDownViewer(url)
        })
        console.log('>>> new Md routers', newMdRouters)
        setMdRouters(newMdRouters)
      }
      console.log('>>>> INDEX storageData', storageIsLoading, storageData)
      setAppIsLoaded(true)
    }
  }, [ storageData, storageIsLoading ])
  
  if (!appIsLoaded) {
    return (<div> Loading </div>)
  }
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto p-10 mt-10 max-sm:p-4 max-sm:mt-0 max-sm:pt-10 flex-grow">
          <HashRouterViews
            views={{
              ...viewsPaths,
              ...mdRouters
            }}
            props={{
              appIsConfigured
            }}
            on404={Page404}
          />
        </div>
        <Footer />
      </div>
    </>
  )
}

export default MyStakeApp;
