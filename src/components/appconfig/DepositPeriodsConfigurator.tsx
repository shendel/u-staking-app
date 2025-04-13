import React, { useState, useEffect } from "react";
import PeriodCard from "./DepositPeriod/PeriodCard";
import InfoField from  '@/components/appconfig/ui/InfoField'
import Button from '@/components/appconfig/ui/Button'
import { useConfirmationModal } from "@/components/ConfirmationModal";
import { useNotification } from "@/contexts/NotificationContext";
import { AnimatePresence, motion } from "framer-motion";

const DepositPeriodsConfigurator = (options) => {
  const {
    isContractEdit = false,
    isReadOnly = false,
    onPeriodChange,
    onPeriodDelete,
    onPeriodsUpdated,
    onPeriodEdit,
    lockPeriods = [],
  } = options
  
  const { openModal } = useConfirmationModal();
  const { addNotification } = useNotification();
  
  const [periods, setPeriods] = useState(lockPeriods/*[
    {
      id: 1,
      lockTimeDays: 10,
      percentageBasisPoints: 1000,
      maxRate: 10000,
      minRate: 500,
      decrementStep: 5,
      stepSize: 100000,
      fixedBasisPoints: true,
    },
    {
      id: 2,
      lockTimeDays: 30,
      percentageBasisPoints: 2000,
      maxRate: 10000,
      minRate: 2000,
      decrementStep: 10,
      stepSize: 200000,
      fixedBasisPoints: false,
    },
  ]*/);
  
  const getNewId = () => {
    let newId = 1
    periods.forEach(( { id } ) => {
      if (id >= newId) newId = id + 1
    })
    return newId
  }
  const getPeriodIndex = (needId) => {
    let i = false
    periods.find(({ id }, index ) => {
      if (id == needId) i = index
    })
    return i
  }
  const [ periodsPrevData, setPeriodsPrevData ] = useState([])
  
  const [ isEditable, setIsEditable ] = useState([]);
  
  const [ newPeriods, setNewPeriods ] = useState([])

  useEffect(() => {
    if (onPeriodEdit) {
      onPeriodEdit(isEditable)
    }
  }, [ isEditable ] )
  
  const handleBeginEdit = (periodId) => {
    console.log('> handle begin edit', periodId)
    setIsEditable((prevIsEditable) => [
      ...prevIsEditable,
      periodId
    ])
    console.log(periodsPrevData)
    const newPeriodsPrevData = periodsPrevData
    newPeriodsPrevData[periodId] = {
      ...periods.find(( { id } ) => { return (id == periodId) })
    }
    console.log('>>> newPeriodsPrevData', newPeriodsPrevData)
    setPeriodsPrevData(newPeriodsPrevData)
  }
  const handleDiscardChanges = (periodId) => {
    const index = getPeriodIndex(periodId)
    console.log('>> index', index, periodId)
    setIsEditable((prevIsEditable) =>
      prevIsEditable.filter((id) => id !== periodId)
    );
    const prevPeriodData = periodsPrevData.find(( periodData ) => {
      if (periodData && periodData.id && periodData.id == periodId) return true
    })
    const newPeriodsData = [...periods]
    newPeriodsData[index] = {
      ...prevPeriodData
    }
    setPeriods(newPeriodsData)
    console.log('>>> handleDiscardChanges', index)
  }
  const handleDiscardNewPeriod = (periodId) => {
    console.log('>>>> handleDiscardNewPeriod', periodId)
    openModal({
      title: 'Confirm Action',
      description: 'Discart changes and remove this lock period?',
      onConfirm: () => {
        setPeriods((prevPeriods) =>
          prevPeriods.filter(({ id }) => id !== periodId)
        );
        setIsEditable((prevIsEditable) =>
          prevIsEditable.filter((id) => id !== periodId)
        );
        addNotification('success', 'Lock Period removed')
      }
    })
  }
  const processUpdatedData = (updatedPeriods) => {
    if (onPeriodsUpdated) {
      onPeriodsUpdated(updatedPeriods)
    }
  }
  const handleApplyChanges = (periodId) => {
    console.log('>>> handleApplyChanges', periodId)
    const _apply = () => {
      const newIsEditable = isEditable.filter((id) => id !== periodId)
      setIsEditable(newIsEditable)

      processUpdatedData(periods.filter(({id}) => {
        return newIsEditable.indexOf(id) == -1
      }))
    }
    const _markAsSave = () => {
      const index = getPeriodIndex(periodId)
      const saveData = periods[index]
      const newPeriods = [
        ...periods
      ]
      newPeriods[index].isNew = false
      setPeriods(newPeriods)
    }
    if (isContractEdit) {
      console.log('>>> OPEN MODAL')
      openModal({
        title: "Confirm Action",
        description: "Are you sure you want save changes to contract?",
        okTitle: "Yes",
        onConfirm: () => {
          console.log('>>> DO SAVE TO CONTRACT')

          if (onPeriodChange) {
            const saveData = periods[getPeriodIndex(periodId)]
            console.log('>>> SAVE TO CONTRACT', saveData)
            onPeriodChange(saveData).then((isOk) => {
              _apply()
              _markAsSave()
              addNotification(
                "success",
                "Lock period updated"
              );
            }).catch((err) => {
              addNotification('error', 'Fail update lock period')
            })
          } else {
            console.log('>>> not defined onPeriodChange at contract')
            _apply()
            _markAsSave()
          }
        }
      })
    } else {
      _apply()
      _markAsSave()
    }
  }
  const hasLockDays = (days, periodId) => {
    const period = periods.find(({ lockTimeDays, id }) => {
      if (lockTimeDays == days && id != periodId) {
        return true
      }
    })
    return !!(period)
  }
  // Обработчик изменения значения поля
  const handleChange = (needId, field, value) => {
    const newPeriods = [...periods];
    const index = getPeriodIndex(needId)
    console.log('>>> ID', needId, index)
    newPeriods[index][field] = value;
    setPeriods(newPeriods);
  };

  // Добавление нового периода
  const addPeriod = () => {
    const newPeriodId = getNewId()
    setPeriods((prevPeriods) => [
      ...prevPeriods,
      {
        id: newPeriodId,
        lockTimeDays: 0,
        percentageBasisPoints: 1,
        maxRate: 1,
        minRate: 1,
        decrementStep: 1,
        stepSize: 1,
        fixedBasisPoints: true,
        minimumDeposit: 1,
        isNew: true
      },
    ])
    setIsEditable((prevIsEditable) => [
      ...prevIsEditable,
      newPeriodId
    ])
  };

  // Удаление периода
  const removePeriod = (periodId) => {
    const _remove = () => {
      const newPeriods = periods.filter(({ id }) => id !== periodId)
      setPeriods(newPeriods);
      addNotification('success', 'Lock Period removed')
      processUpdatedData(newPeriods.filter(({id}) => {
        return isEditable.indexOf(id) == -1
      }))
    }
    openModal({
      description: "Are you sure wand delete this Lock Period?",
      onConfirm: () => {
        if (isContractEdit) {
          const index = getPeriodIndex(periodId)
          console.log('>>> periodId', periodId, index)
          if (periods[index].isNew) {
            _remove()
          } else {
            // Handle delete from contract
            openModal({
              description: "This Lock period stored at contract. Now we are make tx for remove it. Continue?",
              onConfirm: () => {
                if (onPeriodDelete) {
                  console.log('>>> HANDLE DELETE AT CONTRACT')
                  onPeriodDelete(periods[index]).then((isOk) => {
                    _remove()
                  }).catch((err) => {
                    addNotification('error', 'Fail remove lock period from contract')
                  })
                }
              }
            })
          }
        } else {
          _remove()
        }
      }
    })
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-4">
      <AnimatePresence>
        {/* Список периодов */}
        {periods.length > 0 ? (
          <>
            <InfoField>
              {`1 Basis Point = 0.01%`}
            </InfoField>
            {periods.map((period, index) => (
              <PeriodCard
                key={index}
                periodIndex={index}
                periodData={period}
                isEditable={(isEditable.indexOf(period.id) != -1)} // Режим редактирования
                isContractEdit={isContractEdit}
                isReadOnly={isReadOnly}
                onChange={handleChange}
                onDiscardNew={() => {
                  handleDiscardNewPeriod(period.id)
                }}
                hasLockDays={hasLockDays}
                onEdit={() => {
                  handleBeginEdit(period.id)
                }}
                onDiscard={() => {
                  handleDiscardChanges(period.id)
                }}
                onApply={() => {
                  handleApplyChanges(period.id)
                }}
                onDelete={() => removePeriod(period.id)}
              />
            ))}
          </>
        ) : (
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-2">
            <p className="text-center text-yellow-800 font-bold">
              There are no deposit periods configured.
            </p>
          </div>
        )}
      </AnimatePresence>

      {/* Кнопка добавления нового периода */}
      {!isReadOnly && (
        <div className="grid place-items-center">
          <Button onClick={addPeriod}>
            Add New Period
          </Button>
        </div>
      )}
    </div>
  );
};

export default DepositPeriodsConfigurator;