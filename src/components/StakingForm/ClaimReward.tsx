import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'


const StakingFormClaimReward = (props) => {
  return (
    <div>
      <div className="block text-gray-700 font-bold mb-2 text-center text-xl ">
        {`Claim your rewards`}
      </div>

      {/* Claim Details */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="text-lg font-bold mb-2">Reward details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>Your reward</p>
            <p>Transaction cost</p>
          </div>
          <div>
            <p>0.5 dETH</p>
            <p>$1.20 (0.001)</p>
          </div>
        </div>
      </div>

      {/* Claim Button */}
      <Button>
        {`Claim`}
      </Button>
    </div>
  )
}


export default StakingFormClaimReward