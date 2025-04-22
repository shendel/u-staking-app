import { useState, useEffect } from 'react'
import { useNotification } from "@/contexts/NotificationContext";
import { useConfirmationModal } from "@/components/ConfirmationModal";
import Button from '@/components/appconfig/ui/Button'
import SaveToStorage from '@/components/appconfig/ui/SaveToStorage'
import { useStorageProvider } from '@/storage/StorageProvider'
import CollapsibleGroup from '@/components/appconfig/ui/CollapsibleGroup'
import Label from '@/components/appconfig/ui/Label'
import Input from '@/components/appconfig/ui/Input'
import InputImage from '@/components/appconfig/ui/InputImage'
import InfoField from '@/components/appconfig/ui/InfoField'

const AdminTabsWhiteLabel = (props) => {
  const {
    onSettingsChanged = () => {},
    handleSaveExStorage = () => {}
  } = props

  const {
    storageData: {
      exdata,
      exdata: {
        whitelabel: {
          siteTitle,
          siteDescription,
          siteLogo,
          footerSlogan,
          footerCopyright,
        }
      }
    }

  } = useStorageProvider()
console.log('>>> exdata', exdata)
  const { openModal } = useConfirmationModal();
  const { addNotification } = useNotification();
  
  const [ newSiteTitle, setNewSiteTitle ] = useState(siteTitle)
  const [ newSiteDescription, setNewSiteDescription ] = useState(siteDescription)
  const [ newSiteLogo, setNewSiteLogo ] = useState(siteLogo)
  const [ newFooterSlogan, setNewFooterSlogan ] = useState(footerSlogan)
  const [ newFooterCopyright, setNewFooterCopyright ] = useState(footerCopyright)
  
  return (
    <>
      <div>
        <Label>{`Site title`}</Label>
        <InfoField>
          {`Tag `}
          <span className="font-bold">{`[PAGE_TITLE]`}</span>
          {` will be relaced with currect active page title`}
        </InfoField>
        <Input value={newSiteTitle} setValue={(v) => setNewSiteTitle(v) } />
      </div>
      <div>
        <Label>{`Site description`}</Label>
        <Input value={newSiteDescription} setValue={(v) => setNewSiteDescription(v) } />
      </div>
      <div>
        <Label>{`Logo image URL`}</Label>
        <InputImage value={newSiteLogo} setValue={(v) => setNewSiteLogo(v) } />
      </div>
      <div>
        <Label>{`Footer slogan`}</Label>
        <Input value={newFooterSlogan} setValue={(v) => setNewFooterSlogan(v) } />
      </div>
      <div>
        <Label>{`Footer copyright`}</Label>
        <InfoField>
          {`Tag `}
          <span className="font-bold">{`[YEAR]`}</span>
          {` will be relaced with current year in format YYYY`}
        </InfoField>
        <Input value={newFooterCopyright} setValue={(v) => setNewFooterCopyright(v) } />
      </div>
      <div className="mt-6">
        <SaveToStorage onClick={() => {
          handleSaveExStorage({
            message: 'Do you realy want save WhiteLabel configuration?',
            key: 'whitelabel',
            newData: {
              siteTitle: newSiteTitle,
              siteDescription: newSiteDescription,
              siteLogo: newSiteLogo,
              footerSlogan: newFooterSlogan,
              footerCopyright: newFooterCopyright,
            }
          })
        }}>
          {`Save updated Menu to App configuration`}
        </SaveToStorage>
      </div>
    </>
  )
}

export default AdminTabsWhiteLabel