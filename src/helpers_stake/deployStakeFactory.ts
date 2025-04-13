import StakeFactoryJson from "@/../contracts/artifacts/StakeFactory.json"
import { calcSendArgWithFee } from "@/helpers/calcSendArgWithFee"
import { BigNumber } from 'bignumber.js'
import { toWei } from '@/helpers/wei'

const deployStakeFactory = (options) => {
  return new Promise((resolve, reject) => {
    const {
      activeWeb3,
      stakingTokenInfo,
      rewardTokenInfo,
      taxReciever,
      deductionPercentage,
      lockPeriods,
      onTrx,
      onSuccess,
      onError,
      onFinally,
    } = {
      onTrx: () => {},
      onSuccess: () => {},
      onError: () => {},
      onFinally: () => {},
      ...options
    }

    const periodsData = lockPeriods.map((periodInfo) => {
      const {
        lockTimeDays,
        percentageBasisPoints,
        maxRate,
        minRate,
        decrementStep,
        stepSize,
        fixedBasisPoints,
        minimumDeposit,
      } = periodInfo
      return [
        lockTimeDays,
        toWei(minimumDeposit, stakingTokenInfo.decimals),
        percentageBasisPoints,
        maxRate,
        minRate,
        decrementStep,
        toWei(stepSize, stakingTokenInfo.decimals),
        (fixedBasisPoints) ? true : false,
        0
      ]
    })
    const deployParams = [
      stakingTokenInfo.address,
      rewardTokenInfo.address,
      taxReciever,
      deductionPercentage,
      periodsData
    ]

    activeWeb3.eth.getAccounts().then(async (accounts) => {
      if (accounts.length>0) {
        const activeWallet = accounts[0]
        const mpContract = new activeWeb3.eth.Contract(StakeFactoryJson.abi)

        const txArguments = {
          from: activeWallet,
        }

        const _arguments = [
          ...deployParams
        ]

        const gasAmountCalculated = await mpContract.deploy({
          arguments: _arguments,
          data: StakeFactoryJson.data.bytecode.object
        }).estimateGas(txArguments)

        const gasPrice = await activeWeb3.eth.getGasPrice()
        txArguments.gasPrice = gasPrice

        const gasAmounWithPercentForSuccess = new BigNumber(
          new BigNumber(gasAmountCalculated)
            .multipliedBy(1.05) // + 5% -  множитель добавочного газа, если будет фейл транзакции - увеличит (1.05 +5%, 1.1 +10%)
            .toFixed(0)
        ).toString(16)

        txArguments.gas = '0x' + gasAmounWithPercentForSuccess

        mpContract.deploy({
          data: '0x' + StakeFactoryJson.data.bytecode.object,
          arguments: _arguments,
        })
          .send(txArguments)
          .on('transactionHash', (hash) => {
            console.log('transaction hash:', hash)
            onTrx(hash)
          })
          .on('error', (error) => {
            console.log('transaction error:', error)
            onError(error)
          })
          .on('receipt', (receipt) => {
            console.log('transaction receipt:', receipt)
            onSuccess(receipt.contractAddress)
          })
          .then(() => {
            onFinally()
          })
          .catch((error) => {})
      } else {
        reject('NO_ACTIVE_ACCOUNT')
      }
    }).catch((err) => {
      console.log('>>> deployStakeFactory', err)
      reject(err)
    })
  })
}

export default deployStakeFactory