import { AnimatePresence, motion } from "framer-motion";
import { fromWei } from '@/helpers/wei'
import calculateReward from '@/helpers_stake/calculateReward'
import Button from '@/components/ui/Button'

const UserDepositItem = (props) => {
  const {
    days,
    remaingDays,
    amount,
    canClaim,
    id,
    stakingTokenInfo,
    rewardTokenInfo,
    getApy,
    harvestingId,
    isHarvesting,
    handleHarvest,
    handleWithdraw
  } = props
  return (
    <motion.li
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, height: 0, overflow: 'hidden', transition: { duration: 0.5 } }}
      className="mb-4 bg-gray-100 p-4 rounded-lg"
    >
      <div className="grid grid-cols-2 gap-4 font-bold text-gray-700 border-b pb-1">
        <span>
          {`Staked:`}
        </span>
        <p className="text-right text-orange-500">
          {fromWei(amount, stakingTokenInfo.decimals)}
          {` `}
          {stakingTokenInfo.symbol}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 font-bold text-gray-700 border-b pb-1 pt-1">
        <span>
          {(canClaim) ? `Reward:` : `Remaining reward:`}
        </span>
        <span className="text-right text-orange-500">
          {fromWei(
            calculateReward({
              stakedAmountWei: amount,
              depositTokenDecimals: stakingTokenInfo.decimals,
              rewardTokenDecimals: rewardTokenInfo.decimals,
              apyBasisPoints: getApy(days)
            }),
            rewardTokenInfo.decimals
          )}
          {` `}
          {rewardTokenInfo.symbol}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 font-bold text-gray-700 border-b pb-1 pt-1">
        <span>
          {`APY:`}
        </span>
        <span className="font-bold text-right text-green-700">
          {getApy(days) / 100}%
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 font-bold text-gray-700 border-b pb-1 pt-1">
        <span>
          {`Lock period (days): `}
        </span>
        <span className="text-blue-500 text-right">{days}</span>
      </div>
      {canClaim ? (
        <div className="w-full">
          <Button
            color={`green`}
            fullWidth={true}
            isBold={true}
            isDisabled={(isHarvesting && (harvestingId != id))}
            isLoading={(isHarvesting && (harvestingId == id))}
            onClick={() => { handleHarvest(days, id) }}
          >
            {`Claim reward`}
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 border-b pb-1 pt-1">
            <p className="font-bold text-gray-700">
              {`Remaining Days: `}
            </p>
            <span className="font-bold text-right text-blue-500">{remaingDays}</span>
          </div>
            <div className="w-full">
              <Button
                color={`red`}
                fullWidth={true}
                isBold={true}
                isDisabled={(isHarvesting && (harvestingId != id))}
                isLoading={(isHarvesting && (harvestingId == id))}
                onClick={() => { handleWithdraw(days, id) }}
              >
                {`Withdraw deposit`}
              </Button>
            </div>
        </>
      )}
    </motion.li>
  )
}


export default UserDepositItem