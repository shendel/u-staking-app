import { useState, useEffect } from 'react'
import Button from '@/components/appconfig/ui/Button'
import MenuForm from './MenuForm'
import { useNotification } from "@/contexts/NotificationContext";
import { useConfirmationModal } from "@/components/ConfirmationModal";
import FaIcon from '@/components/FaIcon'

const TableActions = (props) => {
  const {
    index = 0,
    itemsCount = 0,
    onMoveUp = (index) => {},
    onMoveDown = (index) => {},
    onEdit = (index) => {},
    onDelete = (index) => {}
  } = props

  const buttonClass = `text-white w-8 h-8 duration-500 ease-in-out shadow-md transition-all active:scale-95`
  const arrowEnabledClass = `bg-blue-500 hover:bg-blue-600`
  const arrowDisabledClass = `bg-gray-500 active:scale-100`
  //relative  duration-500 ease-in-out shadow-md px-4 py-2 rounded text-white transition-all bg-blue-500 hover:bg-blue-600 active:bg-blue-800 active:scale-95
  return (
    <div className="" >
      <button className={`${buttonClass} rounded-l-md ${(index == 0) ? arrowDisabledClass : arrowEnabledClass}`}
        disabled={!!(index ==0)}
        onClick={onMoveUp}
      >
        <FaIcon icon="arrow-up" />
      </button>
      <button className={`${buttonClass} ${(index == (itemsCount -1)) ? arrowDisabledClass : arrowEnabledClass}`}
        disabled={!!(index == (itemsCount -1))}
        onClick={onMoveDown}
      >
        <FaIcon icon="arrow-down" />
      </button>
      <button className={`bg-blue-500 hover:bg-blue-600 ${buttonClass}`} onClick={onEdit}>
        <FaIcon icon="edit" />
      </button>
      <button className={`rounded-r-md bg-red-500 hover:bg-red-600 ${buttonClass}`} onClick={onDelete}>
        <FaIcon icon="trash" />
      </button>
    </div>
  )
}

const MenuList = (props) => {
  const {
    items = [],
    setItems = () => {},
    fields,
  } = props
  
  const { openModal } = useConfirmationModal()

  const handleDelete = (index) => {
    openModal({
      description: `Delete this menu item?`,
      onConfirm: () => {
        setItems([... items.filter((item, i) => { return i != index }) ])
      }
    })
  }
  const handleEdit = (index) => {
    openModal({
      title: `Edit Menu item`,
      hideBottomButtons: true,
      fullWidth: true,
      onConfirm: (newMenuData) => {
        const newItems = [ ... items ]
        newItems[index] = newMenuData
        setItems(newItems)
      },
      content: (
        <MenuForm initialValues={{ ... items[index] }} fields={fields} />
      )
    })
  }
  const handleAdd = () => {
    openModal({
      title: `Add new Menu item`,
      hideBottomButtons: true,
      fullWidth: true,
      onConfirm: (newMenuData) => {
        console.log('>>> newMenuData', newMenuData)
        setItems([
          ...items,
          ...[ newMenuData ]
        ])
      },
      content: (
        <MenuForm
          isAddNew={true}
          initialValues={{}}
          fields={fields}
        />
      )
    })
  };
  const handleMoveUp = (index) => {
    const item = items[index]
    const upItem = items[index - 1]
    const newMenuData = [...items]
    newMenuData[index - 1] = item
    newMenuData[index] = upItem
    setItems(newMenuData)
  }
  const handleMoveDown = (index) => {
    const item = items[index]
    const dwItem = items[index + 1]
    const newMenuData = [...items]
    newMenuData[index + 1] = item
    newMenuData[index] = dwItem
    setItems(newMenuData)
  }
  
  return (
    <div className="p-2">
      <div className="w-full mb-2">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="align-middle inline-block min-w-full">
              <div className="border-b border-gray-200">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {`Title`}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {`Url`}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {``}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap" width="50%">
                          <div className="text-sm text-gray-900">{item.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap" width="50%">
                          <div className="text-sm text-gray-900">{item.url}</div>
                        </td>
                        <td className="whitespace-nowrap">
                          <TableActions
                            index={index}
                            itemsCount={items.length}
                            onMoveUp={() => handleMoveUp(index) }
                            onMoveDown={() => handleMoveDown(index) }
                            onEdit={() => handleEdit(index) }
                            onDelete={() => handleDelete(index) }
                          />
                        </td>
                      </tr>
                    ))}
                    {items.length == 0 && (
                      <tr>
                        <td colSpan="3" className="px-6 py-4 text-center font-bold text-gray-900">
                          {`empty`}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <Button onClick={handleAdd}>
          {`Add new menu item`}
        </Button>
      </div>
    </div>
  )
}

export default MenuList