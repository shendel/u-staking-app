import React, { useState } from "react";
import RouterForm from "./RouterForm";
import Button from "@/components/appconfig/ui/Button"

import { useNotification } from "@/contexts/NotificationContext";
import { useConfirmationModal } from "@/components/ConfirmationModal";

const RouterList = (props) => {
  const {
    routers,
    setRouters
  } = props
  
  const { openModal } = useConfirmationModal()

  const [editMode, setEditMode] = useState(false);
  const [editingRouterId, setEditingRouterId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleEdit = (routerId) => {
    openModal({
      title: `Change router options`,
      hideBottomButtons: true,
      fullWidth: true,
      onConfirm: (newRouterData) => {
        console.log(' do confirm ', newRouterData )
        const updatedRouters = [...routers]
        updatedRouters[routerId] = newRouterData
        setRouters([
          ...updatedRouters
        ])
      },
      onCancel: () => {
        console.log(' do cancel' )
      },
      content: (
        <RouterForm
          isAddNew={true}
          initialValues={{ ...routers[routerId] }}
        />
      )
    })
  };

  const handleSave = (editedRouter) => {
    const updatedRouters = routers.map((router) =>
      router.id === editingRouterId ? { ...router, ...editedRouter } : router
    );
    setRouters(updatedRouters);
    setEditMode(false);
    setEditingRouterId(null);
  };

  const handleRestore = (routerId) => {
    openModal({
      description: `A you sure want restore router (${routers[routerId]})?`,
      onConfirm: () => {
        const updatedRouters = [ ...routers ]
        updatedRouters[routerId].isDeleted = false
        setRouters(updatedRouters);
      }
    })
  }
  const handleDelete = (routerId) => {
    openModal({
      description: `A you sure want delete this router (${routers[routerId].url})?`,
      onConfirm: () => {
        const updatedRouters = [ ...routers ]
        updatedRouters[routerId].isDeleted = true
        setRouters(updatedRouters);
      }
    })
  };

  const handleAdd = () => {
    openModal({
      title: `Add new router`,
      hideBottomButtons: true,
      fullWidth: true,
      onConfirm: (newRouterData) => {
        console.log(' do confirm ', newRouterData )
        setRouters([
          ...routers,
          ...[ newRouterData ]
        ])
      },
      onCancel: () => {
        console.log(' do cancel' )
      },
      content: (
        <RouterForm
          isAddNew={true}
          initialValues={{
            type: `ROUTER_MD`
          }}
        />
      )
    })
  };

  return (
    <div>
      {/* Список роутеров */}
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="px-4 py-2">Название блока</th>
            <th className="px-4 py-2">Hash блока</th>
            <th className="px-4 py-2">Тип блока</th>
            <th className="px-4 py-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {routers.map((router, index) => (
            <React.Fragment key={index}>
              <tr key={index} className={(router.isDeleted) ? 'bg-gray-300 opacity-50 text-gray-800' : ''}>
                <td className="border border-gray-300 px-4 py-2">
                  {router.title}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {router.url}
                  {router.type == `ROUTER_MD` && (
                    <div>{`Loads file ${router.markdownSource}`}</div>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {router.type}
                </td>
                <td className="border border-gray-300 px-4 py-2 flex justify-end gap-4">
                  {router.isDeleted ? (
                    <Button onClick={() => handleRestore(index)} color={`green`}>
                      {`Restore`}
                    </Button>
                  ) : (
                    <>
                      {!router.readonly && (
                        <>
                          <Button onClick={() => handleEdit(index)}>
                            {`Change`}
                          </Button>
                          <Button onClick={() => handleDelete(index)} color={`red`}>
                            {`Delete`}
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end gap-4 pt-6 pb-6">
        <Button
          color={`blue`}
          isBold={true}
          onClick={handleAdd}
        >
          {`Add new URL router`}
        </Button>
      </div>
    </div>
  );
};

export default RouterList;