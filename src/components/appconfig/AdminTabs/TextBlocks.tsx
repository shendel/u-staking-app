import { useState, useEffect } from 'react'
import { useNotification } from "@/contexts/NotificationContext";
import { useConfirmationModal } from "@/components/ConfirmationModal";
import Button from '@/components/appconfig/ui/Button'
import SaveToStorage from '@/components/appconfig/ui/SaveToStorage'
import { useStorageProvider } from '@/storage/StorageProvider'
import CollapsibleGroup from '@/components/appconfig/ui/CollapsibleGroup'
import Select from '@/components/appconfig/ui/Select'
import Label from '@/components/appconfig/ui/Label'
import Input from '@/components/appconfig/ui/Input'
import InputImage from '@/components/appconfig/ui/InputImage'
import InfoField from '@/components/appconfig/ui/InfoField'
import FormEditMDBlock from '@/components/appconfig/FormEditMDBlock'


const AdminTabsTextBlocks = (props) => {
  const {
    onSettingsChanged = () => {},
    handleSaveExStorage = () => {}
  } = props

  const {
    storageData: {
      exdata,
      exdata: {
        homepage_topBlock: topBlock,
        homepage_middleBlock: middleBlock,
        homepage_bottomBlock: bottomBlock
      }
    }

  } = useStorageProvider()

  const { openModal } = useConfirmationModal();
  const { addNotification } = useNotification();
  
  const blocks = {
    topBlock,
    middleBlock,
    bottomBlock,
  }
  const [ newTopBlockEnabled, setNewTopBlockEnabled ] = useState(topBlock.enabled)
  const [ newTopBlock, setNewTopBlock ] = useState(topBlock.content)

  const [ newMiddleBlockEnabled, setNewMiddleBlockEnabled ] = useState(middleBlock.enabled)
  const [ newMiddleBlock, setNewMiddleBlock ] = useState(middleBlock.content)
  
  const [ newBottomBlockEnabled, setNewBottomBlockEnabled ] = useState(bottomBlock.enabled)
  const [ newBottomBlock, setNewBottomBlock ] = useState(bottomBlock.content)

  const handleOpenForm = (options) => {
    const {
      blockName,
      title,
      description
    } = options
    
    openModal({
      title: `Editing text block "${title}"`,
      hideBottomButtons: true,
      hideClose: true,
      fullWidth: true,
      onConfirm: (newBlockData) => {
        console.log(newBlockData)
        handleSaveExStorage({
          message: `A you realy want save changed "${title}" to app configuration?`,
          key: `homepage_${blockName}`,
          newData: newBlockData
        })
      },
      content: (
        <FormEditMDBlock
          title={title}
          description={description}
          values={{...blocks[blockName]}}
        />
      )
    })
  }
  return (
    <>
      <InfoField>{`There you can configure text blocks at home page`}</InfoField>
      <Label>{`Top text block between the header and the statistics block`}</Label>
      <Button
        fullWidth={true}
        onClick={() => {
          handleOpenForm({
            blockName: 'topBlock',
            title: 'Top block',
            description: `This block between the Header and the Statistic block`
          })
        }}
      >
        {`Edit top text block params`}
      </Button>
      <Label>{`Block between statistics block and staking form`}</Label>
      <Button
        fullWidth={true}
        onClick={() => {
          handleOpenForm({
            blockName: 'middleBlock',
            title: 'Middle block',
            description: `This block between the Statistic block and Stake Form`
          })
        }}
      >
        {`Edit middle text block params`}
      </Button>
      <Label>{`Block between staking form and footer`}</Label>
      <Button
        fullWidth={true}
        onClick={() => {
          handleOpenForm({
            blockName: 'bottomBlock',
            title: 'Bottom block',
            description: `This block between staking form and footer`
          })
        }}
      >
        {`Edit bottom text block params`}
      </Button>
    </>
  )
}

export default AdminTabsTextBlocks