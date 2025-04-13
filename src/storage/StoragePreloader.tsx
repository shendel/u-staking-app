import { useState, useEffect, createContext, useContext } from 'react'
import { useStorageProvider } from './StorageProvider'
import { getStorageInfo } from './'
import { getCurrentDomain } from '@/helpers/getCurrentDomain'
import STORAGE_JSON from './abi/Storage.json'
import EX_STORAGE_JSON from "./abi/ExStorage.json"
import { useStorageContract, useExStorageContract } from './useContract'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const parseInfo = (info) => {
  const parsed = {
    exdata: {},
  }
  const result = JSON.parse(info)
  return result
  /*
  console.log('>>> result', result)
  Object.keys(parsed).forEach((optKey) => {
    if (result[optKey]) parsed[optKey] = result[optKey]
  })
  return parsed
  */
}

const StoragePreloaderContext = createContext({
  isInstalled: false,
  isOwner: false,
  setPreloadedIsOwner: () => {},
  isPreloaded: true,
  storageData: {},
})

export const useStoragePreloader = () => {
  return useContext(StoragePreloaderContext)
}


export default function StoragePreloader(props) {
  const {
    children,
  } = props
  console.log('>>> StorageProvider isPreloading')

  // Load Storage
  const storageContractReadonly = useStorageContract()
  const [ isPreloaded, setIsPreloaded ] = useState(false)
  const [ storageError, setStorageError ] = useState(false)
  const [ storageData, setStorageData ] = useState(null)
  const [ isInstalled, setIsInstalled ] = useState(false)
  const [ isOwner, setIsOwner ] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!storageContractReadonly) {
        console.log('>>> no storage')
        return
      }
      
      setIsPreloaded(false)
      setStorageError(false)
      let parsed: any
      let owner

      try {
        storageData = await storageContractReadonly.methods.getData(getCurrentDomain()).call()
        parsed = parseInfo(storageData.info || '{}')
      } catch (error) {
        console.log('>>> error', error)
        setStorageError(error)
      }

      if (parsed) {
        const { owner } = storageData

        setStorageData({
          ...parsed,
          owner: owner === ZERO_ADDRESS ? '' : owner,
          isInstalled: !(owner === ZERO_ADDRESS),
        })
        setIsInstalled(!(owner === ZERO_ADDRESS))
      } else {
        console.log('>>> not parsed')
      }
      setIsPreloaded(true)
    }
    fetchData()

  }, [ ])

  const {
    storageChainId,
    storageAddress
  } = getStorageInfo()

  const setPreloadedIsOwner = (isOwner) => { setIsOwner(isOwner) }
  return (
    <StoragePreloaderContext.Provider
      value={{
        isInstalled,
        isPreloaded,
        storageData,
        isOwner,
        setPreloadedIsOwner,
      }
    }>
      {children}
    </StoragePreloaderContext.Provider>
  )
}