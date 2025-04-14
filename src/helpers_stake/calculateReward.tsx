import BigNumber from "bignumber.js";
import { fromWei } from '@/helpers/wei'

const calculateReward = (params) => {
  const {
    stakedAmountWei,
    depositTokenDecimals,
    rewardTokenDecimals,
    apyBasisPoints
  } = params
  console.log('>>> calculateReward', params)
  // Создаем объекты BigNumber для входных данных
  const stakedAmount = new BigNumber(stakedAmountWei);
  const apy = new BigNumber(apyBasisPoints);

  // Конвертация застейканой суммы в базовые единицы (например, ETH → dETH)
  const stakedAmountBaseUnits = stakedAmount.div(
    new BigNumber(10).pow(depositTokenDecimals)
  );

  // Расчет вознаграждения в базовых единицах
  const rewardBaseUnits = stakedAmountBaseUnits
    .times(apy)
    .div(10000); // 100% = 10000 базисных пунктов

  // Конвертация вознаграждения обратно в WEI для reward токена
  const rewardWei = rewardBaseUnits.times(
    new BigNumber(10).pow(rewardTokenDecimals)
  );

  //
  /*
    uint256 reward = (depositeToken[msg.sender][_index[z]] * allocation[lockableDays[msg.sender][_index[z]]]) / 10000;
    reward /= 10**uint256(depositTokenDecimals);
  */
  const reward = new BigNumber(stakedAmountWei).times(apyBasisPoints).div(10000)
  //return fromWei(reward, depositTokenDecimals)
  let reward2 = reward.div(new BigNumber(10).pow(depositTokenDecimals))
  console.log('>>>', rewardWei.toFixed(), reward.toFixed(), reward2.toFixed())
  //return reward2.toFixed()
  return rewardWei.toFixed(); // Возвращаем результат как строку
}
export default calculateReward