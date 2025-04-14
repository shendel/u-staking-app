import StakeFactoryJson from '@/../contracts/artifacts/StakeFactory.json'
import callContractMethod from '@/helpers/callContractMethod'

const depositTokens = (options) => {
  const {
    activeWeb3,
    stakeFactoryAddress,
    lockDays,
    amountWei,
    calcGas,
    onTrx = (txHash) => {},
    onSuccess = () => {},
    onError = () => {},
    onFinally = () => {}
  } = options
  
  const contract = new activeWeb3.eth.Contract(StakeFactoryJson.abi, stakeFactoryAddress)
  
  return callContractMethod({
    activeWeb3,
    contract,
    method: 'deposit',
    args: [
      amountWei,
      lockDays
    ],
    calcGas,
    onTrx,
    onSuccess,
    onError,
    onFinally
  })
}


export default depositTokens