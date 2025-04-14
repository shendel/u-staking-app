import StakeFactoryJson from "@/../contracts/artifacts/StakeFactory.json"
import Web3 from 'web3'
import { Interface as AbiInterface } from '@ethersproject/abi'
import { GET_CHAIN_RPC } from '@/web3/chains'
import getMultiCall from '@/web3/getMultiCall'

import { callMulticall } from '@/helpers/callMulticall'
import Web3ObjectToArray from "@/helpers/Web3ObjectToArray"
import { fromWei } from '@/helpers/wei'

const fetchStakeFactory = (options) => {
  const {
    address,
    chainId,
  } = {
    ...options
  }
  return new Promise((resolve, reject) => {
    const chainRpc = GET_CHAIN_RPC(chainId)
    const StakeFactoryAbi = StakeFactoryJson.abi
    if (chainRpc) {
      try {
        const web3 = new Web3(chainRpc)

        const multicall = getMultiCall(chainId)
        const abiI = new AbiInterface(StakeFactoryAbi)

        callMulticall({
          multicall,
          target: address,
          encoder: abiI,
          calls: {
            IS_ULTIMATE_STAKE_FACTORY:  { func: 'IS_ULTIMATE_STAKE_FACTORY' },
            owner:                      { func: 'owner' },
            stakingTokenInfo:           { func: 'getStakeTokenInfo' },
            rewardTokenInfo:            { func: 'getRewardTokenInfo' },
            deductionPercentage:        { func: 'deductionPercentage' },
            taxReceiver:                { func: 'taxreceiver' },
            lockPeriodsInfo:            { func: 'getLockPeriodsInfo', asArray: true },
            usersCount:                 { func: 'usersCount' },
            paused:                     { func: 'paused' },
            time:                       { func: 'time' }
          }
        }).then((mcAnswer) => {
          if (mcAnswer && mcAnswer.IS_ULTIMATE_STAKE_FACTORY) {
            const lockPeriodsInfo = mcAnswer.lockPeriodsInfo.map((periodInfo, id) => {
              return {
                ...periodInfo,
                minimumDepositWei: periodInfo.minimumDeposit,
                minimumDeposit: fromWei(periodInfo.minimumDeposit, mcAnswer.stakingTokenInfo.decimals),
                stepSizeWei: periodInfo.stepSize,
                stepSize: fromWei(periodInfo.stepSize, mcAnswer.stakingTokenInfo.decimals),
                id: (id+1)
              }
            })
            resolve({
              chainId,
              address,
              ...mcAnswer,
              lockPeriodsInfo,
            })
          } else {
            resolve({
              chainId,
              address,
              ...mcAnswer,
              IS_ULTIMATE_STAKE_FACTORY: false
            })
          }
        }).catch((err) => {
          console.log('>>> Fail fetch all info', err)
          reject(err)
        })
      } catch (err) {
        reject(err)
      }
    } else {
      reject(`NOT_SUPPORTED_CHAIN`)
    }
  })
}

export default fetchStakeFactory