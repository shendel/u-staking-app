import StakeFactoryJson from "@/../contracts/artifacts/StakeFactory.json"
import Web3 from 'web3'
import { Interface as AbiInterface } from '@ethersproject/abi'
import { GET_CHAIN_RPC } from '@/web3/chains'
import getMultiCall, { getMultiCallInterface, getMultiCallAddress } from '@/web3/getMultiCall'
import MulticallAbi from '@/abi/MulticallAbi.json'

import { callMulticall } from '@/helpers/callMulticall'
import Web3ObjectToArray from "@/helpers/Web3ObjectToArray"
import { fromWei } from '@/helpers/wei'

const fetchUserDeposits = (options) => {
  const {
    factoryAddress,
    chainId,
    userAddress
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
        const mcI = getMultiCallInterface()

        callMulticall({
          multicall,
          target: factoryAddress,
          encoder: abiI,
          calls: {
            info:  { func: 'getUser', args: [ userAddress ] },
            contractTimeMultiplier: { func: 'time' },
            blockchainTime: { func: 'getCurrentBlockTimestamp', target: getMultiCallAddress(chainId), encoder: mcI }
          }
        }).then((mcAnswer) => {
          const {
            info: {
              DepositeTime,
              DepositeTokens,
              LockableDays,
              DepositeTokenTotal,
              WithdrawAbleReward,
              WithdrawedReward,
              LastUpdated
            },
            contractTimeMultiplier,
            blockchainTime
          } = mcAnswer

          const periods = Object.keys(DepositeTime).map((index) => {

            const unlockTime = Number(DepositeTime[index]) + Number(LockableDays[index]) * Number(contractTimeMultiplier)

            const canClaim = (Number(blockchainTime) > unlockTime)
            return {
              startFrom: DepositeTime[index],
              amount: DepositeTokens[index],
              days: LockableDays[index],
              remaingDays: (!canClaim)
                ? Math.ceil(
                  (unlockTime - Number(blockchainTime)) / contractTimeMultiplier
                ) : 0,
              canClaim
            }
          })

          resolve({
            chainId,
            factoryAddress,
            userAddress,
            periods,
            LastUpdated,
            pendingReward: WithdrawAbleReward,
            givedReward: WithdrawedReward,
          })
        }).catch((err) => {
          console.log('>>> Fail fetch user info', err)
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

export default fetchUserDeposits