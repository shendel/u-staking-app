import StakeFactoryJson from '@/../contracts/artifacts/StakeFactory.json'
import callContractMethod from '@/helpers/callContractMethod'

const harvestTokens = (options) => {
  const {
    activeWeb3,
    stakeFactoryAddress,
    locksIndexes,
    calcGas,
    onTrx = (txHash) => {},
    onSuccess = () => {},
    onError = () => {},
    onFinally = () => {}
  } = options
  console.log('>>> harvestTokens', locksIndexes)
  const contract = new activeWeb3.eth.Contract(StakeFactoryJson.abi, stakeFactoryAddress)
  
  return callContractMethod({
    activeWeb3,
    contract,
    method: 'harwest',
    args: [
      locksIndexes
    ],
    calcGas,
    onTrx,
    onSuccess,
    onError,
    onFinally
  })
}


export default harvestTokens