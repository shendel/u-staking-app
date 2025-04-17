import { useState, useEffect, createContext, useContext } from 'react'
import useStorage, { getStorageInfo } from './'
import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import { calcSendArgWithFee } from "@/helpers/calcSendArgWithFee"
import { getCurrentDomain } from '@/helpers/getCurrentDomain'
import STORAGE_JSON from './abi/Storage.json'
import EX_STORAGE_JSON from "./abi/ExStorage.json"
import { useStorageContract, useExStorageContract } from './useContract'
import { useStoragePreloader } from './StoragePreloader'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const parseInfo = (info) => {
  const parsed = {
    exdata: {},
    mdRouters: [
      { title: 'Home page', url: '/', type: 'ROUTER_HOME', readonly: true },
      { title: 'About', url: '/about', type: 'ROUTER_MD', markdownSource: './about.md' },
    ],
    uStakeChainId: false,
    uStakeContract: false,
  }
  const result = JSON.parse(info)
  Object.keys(parsed).forEach((optKey) => {
    if (result[optKey]) parsed[optKey] = result[optKey]
  })
  return parsed
}

const StorageProviderContext = createContext({
  isOwner: false,
  owner: false,
  isInstalled: false,
  storageIsLoading: true,
  storageData: {},
  storageExData: {},
  doReloadStorage: () => {},
  saveStorage: () => {},
  installAtDomain: () => {},
  saveExStorage: () => {},
  isStorageSave: true,
  storageChainId: false
})

export const useStorageProvider = () => {
  return useContext(StorageProviderContext)
}

export default function StorageProvider(props) {
  const {
    children
  } = props

  const {
    injectedWeb3,
    injectedAccount,
    injectedChainId
  } = useInjectedWeb3()

  const {
    setPreloadedIsOwner
  } = useStoragePreloader()
  
  const [ needRealoadStorage, setNeedReloadStorage ] = useState(true)
  
  // Load Storage
  const storageContractReadonly = useStorageContract()
  const [ storageIsLoading, setStorageIsLoading ] = useState(true)
  const [ storageError, setStorageError ] = useState(false)
  const [ storageData, setStorageData ] = useState(null)
  const [ isInstalled, setIsInstalled ] = useState(false)
  const [ isOwner, setIsOwner ] = useState(false)
  const [ owner, setOwner ] = useState(false)
  
  useEffect(() => {
    if (needRealoadStorage) {
      setNeedReloadStorage(false)
      const fetchData = async () => {
        if (!storageContractReadonly) {
          console.log('>>> no storage')
          return
        }
        
        setStorageIsLoading(true)
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
          setOwner(owner)
          setIsInstalled(!(owner === ZERO_ADDRESS))
          if (injectedAccount && injectedAccount.toLowerCase() === owner.toLowerCase()) {
            setIsOwner(true)
            console.log('>>> DO SET IS OWNER')
            setPreloadedIsOwner(true)
          }
        } else {
          console.log('>>> not parsed')
        }
        setStorageIsLoading(false)
      }
      fetchData()
    }
  }, [ needRealoadStorage ])
  
  useEffect(() => {
    if (storageData && injectedAccount) {
      if (storageData.owner && storageData.owner.toLowerCase() == injectedAccount.toLowerCase()) {
        setTimeout(() => {
          setPreloadedIsOwner(true)
        }, 0)
        setTimeout(() => {
          setIsOwner(true)
        }, 0)
      } else {
        setIsOwner(false)
        setPreloadedIsOwner(false)
      }
    } else {
      setTimeout(() => {
        setIsOwner(false)
      }, 0)
    }
  }, [ injectedAccount, storageData ])

  const {
    storageChainId,
    storageAddress
  } = getStorageInfo()

  const [ storageContract, setStorageContract ] = useState(false)

  useEffect(() => {
    if (storageAddress
      && storageChainId
      && injectedAccount
      && injectedChainId
      && injectedWeb3
      && (storageChainId == injectedChainId)
    ) {
      const storageContract = new injectedWeb3.eth.Contract(STORAGE_JSON.abi, storageAddress)
      setStorageContract(storageContract)
    } else {
      setStorageContract(false)
    }
  }, [ storageAddress, storageChainId, injectedAccount, injectedChainId, injectedWeb3 ])

  const doReloadStorage = () => {
    setNeedReloadStorage(true)
  }

  const [ isStorageSave, setIsStorageSave ] = useState(false)
  
  const saveStorage = async (options) => {
    const {
      onBegin,
      onReady,
      onError,
      newData,
    } = options
    
    const saveData = {
      ...storageData,
      ...newData,
    }
    console.log('>>> saveData', saveData, injectedAccount, storageContract)
    if (injectedAccount && storageContract) {
      if (onBegin) onBegin()
      setIsStorageSave(true)
      const setupTxData = await calcSendArgWithFee(
        injectedAccount,
        storageContract,
        "setKeyData",
        [
          getCurrentDomain(),
          {
            owner: injectedAccount,
            info: JSON.stringify(saveData)
          }
        ]
      )
      console.log('>>> setupTxData', setupTxData)
      storageContract.methods.setKeyData(
        getCurrentDomain(),
        {
          owner: injectedAccount,
          info: JSON.stringify(saveData)
        }
      ).send(setupTxData).then(() => {
        setIsStorageSave(false)
        if (onReady) onReady()
      }).catch((e) => {
        console.log('>>> error', e)
        setIsStorageSave(false)
        if (onError) onError(e)
      })
    }
  }
  const saveExStorage = () => {}
  const installAtDomain = (options = {}) => {
    const {
      onReady,
    } = options
    saveStorage({
      ...(options || {}),
      onReady: () => {
        setNeedReloadStorage(true)
        if (onReady) onReady()
      },
      newData: {
        owner: injectedAccount
      }
    })
  }
  return (
    <StorageProviderContext.Provider
      value={{
        isOwner,
        owner,
        isInstalled,
        storageData,
        doReloadStorage,
        saveStorage,
        isStorageSave,
        storageIsLoading,
        installAtDomain,
        storageChainId
      }
    }>
      {children}
    </StorageProviderContext.Provider>
  )
}