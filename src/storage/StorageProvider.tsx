import { useState, useEffect, createContext, useContext } from 'react'
import useStorage, { getStorageInfo } from './'
import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import { calcSendArgWithFee } from "@/helpers/calcSendArgWithFee"
import { getCurrentDomain } from '@/helpers/getCurrentDomain'
import STORAGE_JSON from './abi/Storage.json'
import EX_STORAGE_JSON from "./abi/ExStorage.json"
import { Interface as AbiInterface } from '@ethersproject/abi'

import { useStorageContract, useExStorageContract } from './useContract'
import { useStoragePreloader } from './StoragePreloader'
import STORAGE_DATA, { STORAGE_EX_DATA } from '@/constants/STORAGE_DATA'

import { callMulticall } from '@/helpers/callMulticall'
import getMultiCall  from '@/web3/getMultiCall'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const parseInfo = (info) => {
  const parsed = { ... STORAGE_DATA }
  const result = JSON.parse(info)
  Object.keys(parsed).forEach((optKey) => {
    if (result[optKey]) parsed[optKey] = result[optKey]
  })
  if (!parsed['exdata']) parsed['exdata'] = {}
  Object.keys(STORAGE_EX_DATA).forEach((optKey) => {
    if (!parsed['exdata'][optKey]) parsed['exdata'][optKey] = STORAGE_EX_DATA[optKey]
  })
  return parsed
}
const applyExData = (data, exdata) => {
  exdata = exdata || []
  
  exdata.forEach(({ key, info }) => {
    info = JSON.parse(info)
    data.exdata[key] = {
      ...(data.exdata[key] || {}),
      ...(info)
    }
  })
  return data
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
  
  const fetchStorageData = () => {
    return new Promise((resolve, reject) => {
      const multicall = getMultiCall(storageChainId)
      const storageAbiInterface = new AbiInterface(STORAGE_JSON.abi)
      const exStorageAbitInterface = new AbiInterface(EX_STORAGE_JSON.abi)

      callMulticall({
        multicall,
        calls: {
          main: { func: 'getData', args: [ getCurrentDomain() ], target: storageAddress, encoder: storageAbiInterface },
          exdata: { func: 'getScopeData', args: [ getCurrentDomain() ], target: exStorageAddress, encoder: exStorageAbitInterface, asArray: true },
          
        }
      }).then((answer) => {
        const {
          main: {
            info,
            owner
          },
          exdata,
        } = answer
        resolve({
          info,
          owner,
          exdata
        })
      }).catch((err) => {
        reject(err)
      })
    })
  }

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
          // storageData = await storageContractReadonly.methods.getData(getCurrentDomain()).call()
          storageData = await fetchStorageData()
          parsed = parseInfo(storageData.info || '{}')
          parsed = applyExData(parsed, storageData.exdata)
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
    storageAddress,
    exStorageAddress
  } = getStorageInfo()

  const [ storageContract, setStorageContract ] = useState(false)
  const [ exStorageContract, setExStorageContract ] = useState(false)

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
      const exStorageContract = new injectedWeb3.eth.Contract(EX_STORAGE_JSON.abi, exStorageAddress)
      setExStorageContract(exStorageContract)
    } else {
      setStorageContract(false)
      setExStorageContract(false)
    }
  }, [ storageAddress, exStorageAddress, storageChainId, injectedAccount, injectedChainId, injectedWeb3 ])

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
      exdata: {}
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
  const saveExStorage = async (options) => {
    const {
      onBegin,
      onReady,
      onError,
      key,
      newData,
    } = options

    console.log('>>> saveData', key, newData, injectedAccount, exStorageContract)
    if (injectedAccount && exStorageContract) {
      if (onBegin) onBegin()
      setIsStorageSave(true)
      const setupTxData = await calcSendArgWithFee(
        injectedAccount,
        exStorageContract,
        "setScopeKeyData",
        [
          getCurrentDomain(),
          key,
          JSON.stringify(newData)
        ]
      )
      console.log('>>> setupTxData', setupTxData)
      exStorageContract.methods.setScopeKeyData(
        getCurrentDomain(),
        key,
         JSON.stringify(newData)
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
        saveExStorage,
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