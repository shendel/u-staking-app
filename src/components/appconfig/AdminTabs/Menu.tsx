import { useState, useEffect } from 'react'
import MenuList from '@/components/appconfig/MenuList/'
import { useNotification } from "@/contexts/NotificationContext";
import { useConfirmationModal } from "@/components/ConfirmationModal";
import Button from '@/components/appconfig/ui/Button'
import SaveToStorage from '@/components/appconfig/ui/SaveToStorage'
import { useStorageProvider } from '@/storage/StorageProvider'
import CollapsibleGroup from '@/components/appconfig/ui/CollapsibleGroup'

const AdminTabsMenu = (props) => {
  const {
    onSettingsChanged = () => {},
    handleSaveStorage = () => {}
  } = props

  const {
    storageData,
    storageData: {
      headerMenu,
      footerMenu,
      socialLinks
    }
  } = useStorageProvider()

  const { openModal } = useConfirmationModal();
  const { addNotification } = useNotification();
  
  const [ newHeaderMenu, setNewHeaderMenu ] = useState(headerMenu)
  const [ newFooterMenu, setNewFooterMenu ] = useState(footerMenu)
  const [ newSocialLink, setNewSocialLink ] = useState(socialLinks)
  
  return (
    <>
      <CollapsibleGroup title={`Header menu items`} noPadds={true} >
        <MenuList items={newHeaderMenu} setItems={setNewHeaderMenu} />
      </CollapsibleGroup>
      <CollapsibleGroup title={`Footer menu items`} noPadds={true}>
        <MenuList items={newFooterMenu} setItems={setNewFooterMenu} />
      </CollapsibleGroup>
      <CollapsibleGroup title={`Social link`} noPadds={true}>
        <MenuList
          items={newSocialLink}
          setItems={setNewSocialLink}
          fields={{
            socialType: {
              type: 'OPTION',
              label: 'Icon',
              values: {
                'NONE' : 'No icon',
                'TELEGRAM' : 'Telegram',
                'X.COM' : 'X (twitter)',
                'GITHUB': 'GitHub',
                'FACEBOOK': 'FaceBook',
                'LINKEDIN': 'LinkedIn'
              }
            }
          }}
        />
      </CollapsibleGroup>
      <div className="mt-10"></div>
      <SaveToStorage onClick={() => {
        handleSaveStorage({
          message: 'Do you realy want save new menu configuration?',
          newData: {
            headerMenu: newHeaderMenu,
            footerMenu: newFooterMenu,
            socialLinks: newSocialLink
          }
        })
      }}>
        {`Save updated Menu to App configuration`}
      </SaveToStorage>
    </>
  )
}

export default AdminTabsMenu