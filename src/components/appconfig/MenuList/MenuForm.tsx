import React, { useState } from "react";
import Button from '@/components/appconfig/ui/Button'
import Label from '@/components/appconfig/ui/Label'
import Input from '@/components/appconfig/ui/Input'
import Select from '@/components/appconfig/ui/Select'
import { useConfirmationModal } from "@/components/ConfirmationModal";


const MenuForm = ({
  initialValues,
  isAddNew,
  fields,
}) => {
  const { closeModal } = useConfirmationModal()
  
  const [formData, setFormData] = useState({
    title: initialValues?.title || "",
    url: initialValues?.url || "",
    ...initialValues,
  });

  const [ errors, setErrors ] = useState({})
  const checkErrors = () => {
    const errors = {}
    if (!formData.title || formData.title=="") {
      errors.title = `Page title is required field`
    }
    if (!formData.url || formData.url == "") { 
        errors.url = `Router URL is required field`
    }
    setErrors(errors)
    return Object.keys(errors).length
  }
  
  const handleChange = ({ name, value }) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleConfirm = () => {
    if (!checkErrors())  {
      closeModal({
        doConfirm: true,
        data: formData,
      })
    }
  }

  return (
    <div className="text-left">
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <div>
          <Label>{`Menu title`}</Label>
          <Input
            error={!!errors?.title}
            errorMessage={errors?.title}
            value={formData.title}
            setValue={(value) => { handleChange({ name: 'title', value }) }}
            require={true}
          />
        </div>
        <div>
          <Label>{`Open in new window`}</Label>
          <Select value={formData.blank} onChange={(value) => { handleChange({ name: 'blank', value } ) }} require={true}>
            <>
              <option value={0}>{`No`}</option>
              <option value={1}>{`Yes, open in new window`}</option>
            </>
          </Select>
        </div>
      </div>
      <div>
        <Label>{`URL`}</Label>
        <Input
          error={!!errors?.url}
          errorMessage={errors?.url}
          value={formData.url}
          setValue={(value) => { handleChange({ name: 'url', value} ) }}
          require={true}
        />
      </div>
      {fields && Object.keys(fields).length && (
        <>
          {Object.keys(fields).map((key) => {
            const field = fields[key]
            switch (field.type) {
              case 'OPTION': {
                return (
                  <div key={key}>
                    <Label>{field.label}</Label>
                    <Select value={formData[key] || ''} onChange={(value) => { handleChange({ name: key, value })}}>
                      <>
                        {Object.keys(field.values).map((v) => {
                          return (
                            <option key={v} value={v}>{field.values[v]}</option>
                          )
                        })}
                      </>
                    </Select>
                  </div>
                )
                break;
              }
              default:
                return (
                  <div key={key}>
                    <Label>{field.label}</Label>
                    <Input value={formData[key] || ''} setValue={(value) => { handleChange({ name: key, value } ) }} />
                  </div>
                )
            }
          })}
        </>
      )}
      <div className="flex justify-end mt-4 space-x-2">
        <Button onClick={() => handleConfirm()}>
          {isAddNew ? `Add new menu item` : `Save changes`}
        </Button>
        <Button color={`red`} onClick={() => {
          closeModal({
            doCancel: true,
            data: formData,
          })
        }}>
          {`Cancel`}
        </Button>
      </div>
    </div>
  );
};

export default MenuForm;