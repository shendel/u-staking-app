import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { useState, useEffect } from "react";

// Регистрация необходимых плагинов и шкал
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ApyChart = ({ lockPeriodParams }) => {
  const [apyData, setApyData] = useState(null);
  const totalTokensInStaking = 5_000_000; // Максимальное количество токенов в контракте
  const stepSize = 100_000; // Шаг для расчета (каждые 10 миллионов токенов)

  // Генерация данных для графика
  useEffect(() => {
    if (lockPeriodParams) {
      const datasets = Object.keys(lockPeriodParams).map((days) => {
        const params = lockPeriodParams[days];
        const dataPoints = [];

        for (let balance = 0; balance <= totalTokensInStaking; balance += stepSize) {
          const multiplier = Math.floor(balance / params.stepSize);
          const minusValue = multiplier * params.decrementStep;

          let apy =
            params.maxRate - minusValue > params.minRate
              ? params.maxRate - minusValue
              : params.minRate;

          dataPoints.push(apy); // Преобразуем базисные пункты в проценты
        }

        return {
          label: `${params.lockTimeDays} days`,
          data: dataPoints,
          borderColor: getRandomColor(),
          borderWidth: 2,
          fill: false,
        };
      });

      const labels = Array.from(
        { length: totalTokensInStaking / stepSize + 1 },
        (_, i) => i * stepSize
      );

      setApyData({
        labels,
        datasets,
      });
    }
  }, [lockPeriodParams]);

  // Функция для генерации случайного цвета для каждой линии
  const getRandomColor = () => {
    const colors = [
      "rgba(255, 99, 132, 1)",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Если данные еще не загружены, показываем заглушку
  if (!apyData) {
    return <div>Loading...</div>;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: "Total Tokens in Staking" },
        ticks: {
          stepSize: 100_000,
          callback: (value) => `${value / 1000000}M`, // Отображаем значения в формате "100M"
        },
        min: 0, // Минимальное значение оси X
        max: totalTokensInStaking, // Максимальное значение оси X
      },
      y: {
        title: { display: true, text: "APY %" },
        suggestedMin: 0,
        suggestedMax: 210, // Максимальное значение APY (например, 200%)
        ticks: {
          stepSize: 10, // Шаг сетки по вертикали (10%)
        },
      },
    },
    plugins: {
    },
    width: 600, // Фиксированная ширина
    height: 200, // Фиксированная высота
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">APY Rate Allocation</h2>
      <Line data={apyData} options={options} />
    </div>
  );
};

export default ApyChart;