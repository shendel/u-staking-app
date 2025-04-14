import StakeFactoryJson from "@/../contracts/artifacts/StakeFactory.json"
import Web3 from 'web3'
import { Interface as AbiInterface } from '@ethersproject/abi'
import { GET_CHAIN_RPC } from '@/web3/chains'
import getMultiCall from '@/web3/getMultiCall'

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

        callMulticall({
          multicall,
          target: factoryAddress,
          encoder: abiI,
          calls: {
            info:  { func: 'getUser', args: [ userAddress ] },
          }
        }).then((mcAnswer) => {
          resolve({
            chainId,
            factoryAddress,
            userAddress,
            ...mcAnswer,
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