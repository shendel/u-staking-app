import BigNumber from "bignumber.js";
import { fromWei } from '@/helpers/wei'

// Конвертация токенов A в токены B с учетом десятичных знаков
const convertTokenAToTokenB = (params) => {
  const {
    inAmountTokenA, tokenADecimals, tokenBDecimals
  } = params
  const amount = new BigNumber(inAmountTokenA);

  if (tokenADecimals > tokenBDecimals) {
    // Если у TokenA больше десятичных знаков, делим на 10^(разница)
    const difference = tokenADecimals - tokenBDecimals;
    return amount.div(new BigNumber(10).pow(difference)).toFixed(0); // Возвращаем целое число
  } else if (tokenADecimals < tokenBDecimals) {
    // Если у TokenB больше десятичных знаков, умножаем на 10^(разница)
    const difference = tokenBDecimals - tokenADecimals;
    return amount.times(new BigNumber(10).pow(difference)).toFixed(0); // Возвращаем целое число
  } else {
    // Если количество десятичных знаков одинаковое, просто возвращаем входное значение
    return amount.toFixed(0); // Возвращаем целое число
  }
}

// Расчет вознаграждения
const calculateReward = (params) => {
  // depositAmount, apyBasePoints, depositTokenDecimals, rewardTokenDecimals
  const {
    stakedAmountWei,
    depositTokenDecimals,
    rewardTokenDecimals,
    apyBasisPoints
  } = params

  const deposit = new BigNumber(stakedAmountWei);
  const apy = new BigNumber(apyBasisPoints);

  // Расчет вознаграждения в базовых единицах токена A
  const rewardInTokenA = deposit.times(apy).div(10000).toFixed(0);

  const rewardInTokenB = convertTokenAToTokenB({
    inAmountTokenA: rewardInTokenA,
    tokenADecimals: depositTokenDecimals,
    tokenBDecimals: rewardTokenDecimals
  });

  return rewardInTokenB; // Возвращаем результат в WEI токенов B
}

export default calculateReward