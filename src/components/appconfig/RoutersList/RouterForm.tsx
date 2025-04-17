import React, { useState } from "react";
import Button from '@/components/appconfig/ui/Button'
import Label from '@/components/appconfig/ui/Label'
import Input from '@/components/appconfig/ui/Input'
import Select from '@/components/appconfig/ui/Select'
import { useConfirmationModal } from "@/components/ConfirmationModal";


const RouterForm = ({
  initialValues,
  isAddNew,
}) => {
  const { closeModal } = useConfirmationModal()
  
  const [formData, setFormData] = useState({
    title: initialValues?.title || "",
    url: initialValues?.url || "",
    type: initialValues?.type || "",
    markdownSource: '',
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
    if (formData.type = `ROUTER_MD`) {
      if (!formData?.markdownSource || formData?.markdownSource == "") {
        errors.markdownSource = `URL to source file with MarkDown content is require`
      }
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
      <div>
        <Label>{`Page title`}</Label>
        <Input
          error={!!errors?.title}
          errorMessage={errors?.title}
          value={formData.title}
          setValue={(value) => { handleChange({ name: 'title', value }) }}
          require={true}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
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
        <div>
          <Label>{`Router type`}</Label>
          <Select value={formData.type} onChange={(value) => { handleChange({ name: 'type', value } ) }} require={true}>
            <>
              <option value={`ROUTER_HOME`}>{`Home page`}</option>
              <option value={`ROUTER_MD`}>{`MarkDown page`}</option>
            </>
          </Select>
        </div>
      </div>
      {formData.type == `ROUTER_MD` && (
        <div>
          <Label>{`URL to source MarkDown file (example "./about.md")`}</Label>
          <Input
            error={!!errors?.markdownSource}
            errorMessage={errors?.markdownSource}
            value={formData?.markdownSource}
            setValue={(value) => { handleChange({ name: 'markdownSource', value } ) }}
          />
        </div>
      )}
      <div className="flex justify-end mt-4 space-x-2">
        <Button onClick={() => handleConfirm()}>
          {isAddNew ? `Add new Router` : `Save changes`}
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

export default RouterForm;