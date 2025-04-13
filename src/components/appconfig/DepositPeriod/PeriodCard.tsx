import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CollapsibleGroup from "@/components/appconfig/ui/CollapsibleGroup";
import ApySimulation from './ApySimulation'
import InputBasisPoint from '@/components/appconfig/ui/InputBasisPoint'
import InputNumber from '@/components/appconfig/ui/InputNumber'
import Button from '@/components/appconfig/ui/Button'


const PeriodCard = (options) => {
  const {
    periodIndex,
    periodData,
    isEditable,
    isReadOnly = false,
    onChange,
    onEdit,
    onApply,
    onDiscard,
    onDelete,
    isContractEdit,
    hasLockDays,
    onDiscardNew
  } = options
  const {
    id: periodId,
    percentageBasisPoints,
    maxRate,
    minRate,
    minimumDeposit,
    decrementStep,
    lockTimeDays,
    isNew,
  } = periodData
  
  const [ errors, setErrors ] = useState({})
  
  const showError = (field, message) => {
    setErrors({
      ...errors,
      [`${field}`]: message
    })
  }
  
  const clearError = (field) => {
    setErrors({
      ...errors,
      [`${field}`]: false
    })
  }

  const handleCheckErrors = (field, value) => {
    switch (field) {
      case 'percentageBasisPoints':
        if ((value < 1) || (value > 10000)) {
          showError(
            'percentageBasisPoints',
            'Percentage APY must be from 1 to 10000'
          )
        } else {
          clearError('percentageBasisPoints')
        }
        break;
      case 'maxRate':
        if (value < 1 || value > 10000) {
          return showError(
            'maxRate',
            'Max Rate must be from 1 to 10000'
          )
        }
        if (maxRate < minRate) {
          return showError(
            'maxRate',
            'Max Rate must be great or equal with Min Rate'
          )
        }
        clearError('maxRate')
        break;
      case 'minRate':
        if (value < 1 || value > 10000) {
          return showError(
            'minRate',
            'Min Rate must be from 1 to 20000'
          )
        }
        if (minRate > maxRate) {
          return showError(
            'minRate',
            'Min Rate must be equal or less with Max Rate'
          )
        }
        clearError('minRate')
        break;
      case 'decrementStep':
        if (value < 1 || value > 1000) {
          return showError(
            'decrementStep',
            'Decrement Step must be from 1 to 1000'
          )
        }
        clearError('decrementStep')
        break;
      case 'lockTimeDays':
        console.log('>>> check lockTimeDays', value, periodId)
        if (hasLockDays(value, periodId)) {
          return showError(
            'lockTimeDays',
            'Already exists period with same lock day time'
          )
        }
        clearError('lockTimeDays')
        break;
    }
  }
  const hasErrors = (() => {
    const err = Object.keys(errors).filter((k) => {
      return errors[k] != false
    })
    return err.length > 0
  })()

  const classApplyEnabled = `bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600`
  const classApplyDisabled = `bg-gray-500 text-white px-4 py-2 rounded mr-2`
  
  const saveEnabled = (lockTimeDays > 0)
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1, transition: { duration: 0.5 } }}
      exit={{ height: 0, overflow: "hidden", opacity: 0, transition: { duration: 0.5 } }}
      className="bg-gray-100 p-4 rounded-lg shadow-md mb-4"
    >
      <h4 className="text-xl font-bold mb-4">Period {periodIndex + 1} Days #{periodData.id}</h4>
      {/* Параметры периода */}
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        {/* Выпадающий список для типа ставки */}
        <div>
          <label htmlFor={`rateType-${periodIndex}`} className="block text-gray-700 font-bold mb-2">
            Rate Type:
          </label>
          {isEditable ? (
            <select
              id={`rateType-${periodIndex}`}
              value={(periodData.fixedBasisPoints) ? "1" : "0"}
              onChange={(e) => {
                onChange(periodId, "fixedBasisPoints", parseInt(e.target.value) ? true : false)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="1">Fixed Rate</option>
              <option value="0">Dynamic Rate</option>
            </select>
          ) : (
            <p className="text-gray-500">
              {((periodData.fixedBasisPoints == "1") ? `Fixed Rate` : `Dynamic Rate`)}
            </p>
          )}
        </div>
        
        {/* Lock Time (Days) */}
        <InputNumber
          label={`Lock Time (Days):`}
          value={lockTimeDays}
          isEditable={isEditable}
          disabled={isContractEdit && !isNew}
          setValue={(v) => {
            handleCheckErrors('lockTimeDays', v)
            onChange(periodId, "lockTimeDays", v)
          }}
          onBlur={() => {
            handleCheckErrors('lockTimeDays', lockTimeDays)
          }}
          error={errors.lockTimeDays || lockTimeDays <= 0}
          errorMessage={errors.lockTimeDays}
        />
        {/* Minimum deposit amount */}
        <InputNumber
          label={`Minimum deposit amount::`}
          value={minimumDeposit}
          isEditable={isEditable}
          setValue={(v) => {
            handleCheckErrors('minimumDeposit', v)
            onChange(periodId, "minimumDeposit", v)
          }}
          onBlur={() => {
            handleCheckErrors('minimumDeposit', minimumDeposit)
          }}
          error={errors.minimumDeposit || minimumDeposit <= 0}
          errorMessage={errors.minimumDeposit}
        />
        {/* Percentage Basis Points */}
        <InputBasisPoint
          label={`Percentage APY (Basis Points):`}
          value={percentageBasisPoints}
          isEditable={isEditable}
          error={errors.percentageBasisPoints || percentageBasisPoints <= 0}
          errorMessage={errors.percentageBasisPoints}
          disabled={!!(periodData.fixedBasisPoints == "0")}
          onBlur={() => {
            handleCheckErrors('percentageBasisPoints', percentageBasisPoints)
          }}
          onFocus={() => { clearError('percentageBasisPoints') }}
          setValue={(v) => {
            handleCheckErrors('percentageBasisPoints', v)
            onChange( periodId, "percentageBasisPoints", v )
            onChange( periodId, "minRate", v )
            onChange( periodId, "maxRate", v )
          }}
        />
        {!periodData.fixedBasisPoints && (
          <>
            {/* Max Rate */}
            <InputBasisPoint
              label={`Max Rate (Basis Points):`}
              value={maxRate}
              isEditable={isEditable}
              error={errors.maxRate}
              errorMessage={errors.maxRate}
              onBlur={() => {
                handleCheckErrors('maxRate', maxRate)
              }}
              onFocus={() => {
                clearError('maxRate')
              }}
              setValue={(v) => {
                console.log('>>> V', v)
                handleCheckErrors('maxRate', v)
                onChange( periodId, "maxRate", v )
                onChange( periodId, "percentageBasisPoints", v )
              }}
            />
            {/* Min Rate */}
            <InputBasisPoint
              label={`Min Rate (Basis Points):`}
              value={minRate}
              isEditable={isEditable}
              error={errors.minRate}
              errorMessage={errors.minRate}
              onBlur={() => {
                handleCheckErrors('minRate', minRate)
              }}
              onFocus={() => {
                clearError('minRate')
              }}
              setValue={(v) => {
                handleCheckErrors('minRate', minRate)
                onChange(
                  periodId,
                  "minRate",
                  v
                )
              }}
            />
            {/* Decrement Step */}
            <InputBasisPoint
              label={`Decrement Step (Basis Points):`}
              value={decrementStep}
              isEditable={isEditable}
              error={errors.decrementStep}
              errorMessage={errors.decrementStep}
              onBlur={() => {
                handleCheckErrors('decrementStep', decrementStep)
              }}
              onFocus={() => {
                clearError('decrementStep')
              }}
              setValue={(v) => {
                handleCheckErrors('decrementStep', v)
                onChange(
                  periodId,
                  "decrementStep",
                  v
                )
              }}
            />
            {/* Step Size */}
            <div>
              <label htmlFor={`stepSize-${periodIndex}`} className="block text-gray-700 font-bold mb-2">
                Decrement Step Size (Per each Tokens amount):
              </label>
              {isEditable ? (
                <input
                  type="number"
                  id={`stepSize-${periodIndex}`}
                  value={periodData.stepSize}
                  onChange={(e) =>
                    onChange(periodId, "stepSize", parseInt(e.target.value))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-500">{periodData.stepSize}</p>
              )}
            </div>
          </>
        )}
      </div>
      {/* Кнопки управления (только для редактируемой версии) */}
      {isEditable && !periodData.fixedBasisPoints && (
        <CollapsibleGroup title="Simulate Dinamic APY">
          <ApySimulation
            minRate={periodData.minRate}
            maxRate={periodData.maxRate}
            decrementStep={periodData.decrementStep}
            stepSize={periodData.stepSize}
          />
        </CollapsibleGroup>
      )}
      {!isReadOnly && (
        <>
          {isEditable ? (
            <div className="flex justify-end mt-4 space-x-2">
              <Button isDisabled={hasErrors || !saveEnabled} onClick={onApply}>
                {isContractEdit ? `Save changes to contract`: `Apply changes`}
              </Button>
              <Button color={`red`} onClick={(isNew) ? onDiscardNew : onDiscard}>
                {(isNew) ? `Discart` : `Cancel`}
              </Button>
            </div>
          ) : (
            <div className="flex justify-end mt-4 space-x-2">
              <Button onClick={onEdit}>
                Edit
              </Button>
              <Button color={`red`} onClick={onDelete}>
                Delete
              </Button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default PeriodCard;