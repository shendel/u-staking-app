import { useState, useEffect } from 'react'

import Web3Connector from '@/web3/Web3Connector'
import InjectedWeb3Provider from '@/web3/InjectedWeb3Provider'
import StorageProvider from '@/storage/StorageProvider'
import ConfirmationModal from "./ConfirmationModal";
import NotificationProvider from "@/contexts/NotificationContext"
import { useStoragePreloader } from '@/storage/StoragePreloader'

import NETWORKS from '@/constants/NETWORKS'
import {
  MAINNET_CHAIN_ID,
} from '@/config'

const allChainIds = Object.keys(NETWORKS).map((slug) => {
  return NETWORKS[slug].chainId
})

export default function AppRoot(props) {
  const {
    children,
    checkAppIsConfigured = (storageData) => { return '56' }
  } = props

  const chainId = MAINNET_CHAIN_ID
  const chainIds = [MAINNET_CHAIN_ID]
  
  const {
    isPreloaded,
    isInstalled,
    storageData,
    setPreloadedIsOwner,
    isOwner
  } = useStoragePreloader()
  const [ workChainId, setWorkChainId ] = useState(chainId)
  const [ allowedChainIds, setAllowedChainIds ] = useState(chainIds)

  useEffect(() => {
    console.log('>>> configure chains', isPreloaded, isInstalled, isOwner)
    if (isPreloaded) {
      if (!isInstalled) {
        setWorkChainId(chainId)
        setAllowedChainIds(chainIds)
      } else {
        const appChainId = checkAppIsConfigured(storageData)
        if (appChainId) {
          setWorkChainId(appChainId)
          if (isOwner) {
            setAllowedChainIds(allChainIds)
          } else {
            setAllowedChainIds([appChainId])
          }
        } else {
          setAllowedChainIds(allChainIds)
        }
      }
    }
  }, [ isPreloaded, isOwner ] )

  return (
    <>
      <NotificationProvider>
        <Web3Connector chainIds={allowedChainIds} autoConnect={true}>
          <InjectedWeb3Provider chainId={workChainId} chainIds={allowedChainIds}>
            <StorageProvider>
              <ConfirmationModal>
                {children}
              </ConfirmationModal>
            </StorageProvider>
          </InjectedWeb3Provider>
        </Web3Connector>
      </NotificationProvider>
    </>
  )
}