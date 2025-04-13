import { useStorageContract, useExStorageContract } from './useContract'
import { useEffect, useState } from 'react'
import { getCurrentDomain } from "@/helpers/getCurrentDomain"

import isProd from "@/helpers/isProd"
import NETWORKS from "@/constants/NETWORKS"

const storageChainIdMainnet = 11155111
const storageChainIdTestnet = 11155111



const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'


export const getStorageInfo = () => {
  const _isProd = isProd()
  
  const storageChainId = _isProd ? storageChainIdMainnet : storageChainIdTestnet
  const storageChainSlug = Object.keys(NETWORKS).find((slug) => {
    if (NETWORKS[slug].chainId == storageChainId) return true
  })
  const storageChainInfo = NETWORKS[storageChainSlug]
  const storageRpc = storageChainInfo.rpc
  const storageAddress = storageChainInfo.storage
  const exStorageAddress = storageChainInfo.exStorage

  return {
    storageChainId,
    storageAddress,
    exStorageAddress,
    storageRpc,
    storageChainInfo,
  }
}


const parseInfo = (info) => {
  const parsed = {
    exdata: {},
  }
  const result = JSON.parse(info)

  Object.keys(parsed).forEach((optKey) => {
    if (result[optKey]) parsed[optKey] = result[optKey]
  })
  return parsed
}

const parseExInfo = (info) => {
  const parsed = {}
  info.forEach((data) => {
    try {
      parsed[data.key] = JSON.parse(data.info)
    } catch (e) {
      console.warn(`>>> Not parseble exStorage data: key=${data.key} info=${data.info}`)
    }
  })
  return parsed
}

export default function useStorage(options) {
  const {
    connectedWallet,
    exDataKeys
  } = options
  
  const [storageData, setStorageData] = useState(null)
  const [storageExData, setStorageExData ] = useState(null)
  const [storageIsLoading, setStorageIsLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isStakeInstalled, setIsStakeInstalled] = useState(false)
  const [error, setError] = useState(null)

  const storage = useStorageContract()
  const exStorage = useExStorageContract()
  
  const [ doReloadStorage, setDoReloadStorage ] = useState(true)

  useEffect(() => {
    console.log('>>> useState')
    if (doReloadStorage) {
    console.log('>>> DO LOAD')
      const fetchData = async () => {
        if (!storage) {
          console.log('>>> no storage')
          return
        }
        if (!exStorage) {
          console.log('>>> no exStorage')
          return
        }
        
        setError(null)
        setStorageIsLoading(true)
        
        let parsed: any
        let owner

        try {
          storageData = await storage.methods.getData(getCurrentDomain()).call()
          console.log('>>> STORAGE FETCHED', storageData)
          parsed = parseInfo(storageData.info || '{}')
        } catch (error) {
          console.log('>>> error', error)
          setError(error)
        }
        // ExStorage
        try {
          const exStorageData = await exStorage.methods.getScopeData(getCurrentDomain()).call()
          parsed = {
            ...parsed,
            exdata: parseExInfo(exStorageData || [])
          }
        } catch (error) {
          console.log('>>> error', error)
          setError(error)
        }
        if (parsed) {
          const { owner } = storageData

          setStorageData({
            ...parsed,
            owner: owner === ZERO_ADDRESS ? '' : owner,
            isInstalled: !(owner === ZERO_ADDRESS),
          })
          setIsInstalled(!(owner === ZERO_ADDRESS))
          if (connectedWallet && connectedWallet.toLowerCase() === owner.toLowerCase()) {
            setIsOwner(true)
          }
        } else {
          console.log('>>> not parsed')
        }
        
        setStorageIsLoading(false)
      }
      fetchData()
      setDoReloadStorage(false)
    }
  }, [ doReloadStorage ])

  return {
    storageIsLoading,
    storageData,
    isOwner,
    isInstalled,
    error,
    setDoReloadStorage,
    
  }
}