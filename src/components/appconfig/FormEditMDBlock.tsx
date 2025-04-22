import { useState, useEffect } from 'react'
import Label from '@/components/appconfig/ui/Label'
import Select from '@/components/appconfig/ui/Select'
import Button from '@/components/appconfig/ui/Button'
import Input from '@/components/appconfig/ui/Input'
import InfoField from '@/components/appconfig/ui/InfoField'
import { useConfirmationModal } from "@/components/ConfirmationModal";
import MarkdownEditor from '@/components/appconfig/ui/MarkdownEditor'
import SaveToStorage from '@/components/appconfig/ui/SaveToStorage'

const FormEditMDBlock = (props) => {
  const {
    title,
    description,
    values: {
      enabled,
      content,
    }
  } = {
    title: 'Top Block',
    description: false,
    values: {
      enabled: 0,
      content: '',
    },
    ...props
  }
  
  const { closeModal } = useConfirmationModal()
  
  const [ newEnabled, setNewEnabled ] = useState(enabled)
  const [ newContent, setNewContent ] = useState(content)
  
  const handleConfirm = () => {
    closeModal({
      doConfirm: true,
      data: {
        enabled: newEnabled,
        content: newContent,
      }
    })
  }
  
  return (
    <div>
      {description && (description !== null) && (
        <InfoField>{description}</InfoField>
      )}
      <div>
        <Label>{`"${title}" is enabled`}</Label>
      </div>
      <div>
        <Select value={newEnabled} onChange={(v) => setNewEnabled(v)}>
          <>
            <option value={0}>{`No, block disabled`}</option>
            <option value={1}>{`Yes, block enabled`}</option>
          </>
        </Select>
      </div>
      {newEnabled == 1 && (
        <div>
          <Label>{`Block content`}</Label>
          <MarkdownEditor value={newContent} setValue={(v) => setNewContent(v) } />
        </div>
      )}
      <div className="flex justify-end mt-4 space-x-2">
        <div>
          <SaveToStorage onClick={() => handleConfirm()}>
            {`Save changes to app configuration`}
          </SaveToStorage>
        </div>
        <Button color={`red`} onClick={() => { closeModal({ doCancel: true }) }}>
          {`Cancel`}
        </Button>
      </div>
    </div>
  )
}

export default FormEditMDBlock