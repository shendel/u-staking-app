import { useState, useEffect } from 'react'
import RouterList from '@/components/appconfig/RoutersList/'
import { useNotification } from "@/contexts/NotificationContext";
import { useConfirmationModal } from "@/components/ConfirmationModal";
import Button from '@/components/appconfig/ui/Button'
import SaveToStorage from '@/components/appconfig/ui/SaveToStorage'
import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import { useStorageProvider } from '@/storage/StorageProvider'

import {
  getTransactionLink,
  getAddressLink,
  getShortAddress,
  getShortTxHash
} from '@/helpers/etherscan'


const AdminTabsRouters = (props) => {
  const {
    onSettingsChanged = () => {},
    onSaveRouters = () => {}
  } = props

  const {
    storageData,
    storageData: {
      mdRouters,
    }
  } = useStorageProvider()
  
  const [ routers, setRouters ] = useState(mdRouters)

  const {
    injectedWeb3,
    injectedAccount,
    injectedChainId,
    switchNetwork,
  } = useInjectedWeb3()

  const { openModal } = useConfirmationModal();
  const { addNotification } = useNotification();
  
  return (
    <>
      <RouterList routers={routers} setRouters={setRouters} />
      <SaveToStorage onClick={() => {
        onSaveRouters( routers.filter(( { isDeleted } ) => { return !isDeleted } ) )
      }}>
        {`Save updated Routers to App configuration`}
      </SaveToStorage>
    </>
  )
}

export default AdminTabsRouters