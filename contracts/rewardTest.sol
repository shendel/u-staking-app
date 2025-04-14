// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Test {
    function testCalc(
        uint256 stakeAmount,
        uint256 apyPercentage,
        uint8 stakeDecimals,
        uint8 rewardDecimals
    ) public pure returns (uint256 ret) {
        uint256 t = (stakeAmount * apyPercentage) / 10000;
        return convertTokenAToTokenB(t, stakeDecimals, rewardDecimals);
    }

    function convertTokenAToTokenB(
        uint256 inAmountTokenA,
        uint8 tokenADecimals,
        uint8 tokenBDecimals
    ) public pure returns (uint256 outAmountTokenB) {
        if (tokenADecimals > tokenBDecimals) {
            // Если у TokenA больше десятичных знаков, делим на 10^(разница)
            uint256 difference = tokenADecimals - tokenBDecimals;
            outAmountTokenB = inAmountTokenA / (10 ** difference);
        } else if (tokenADecimals < tokenBDecimals) {
            // Если у TokenB больше десятичных знаков, умножаем на 10^(разница)
            uint256 difference = tokenBDecimals - tokenADecimals;
            outAmountTokenB = inAmountTokenA * (10 ** difference);
        } else {
            // Если количество десятичных знаков одинаковое, просто возвращаем входное значение
            outAmountTokenB = inAmountTokenA;
        }
    }
}