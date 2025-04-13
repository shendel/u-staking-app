import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation"; // Импорт плагина аннотаций
import { useState, useEffect } from "react";

// Регистрация необходимых плагинов и шкал
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

const AllocationChart = ({ lockPeriodParams }) => {
  const [chartData, setChartData] = useState(null);

  // Генерация данных для графика
  useEffect(() => {
    if (lockPeriodParams) {
      const tokenBalanceMax = 1_000_000; // Максимальное количество токенов (1 миллион)
      const stepSize = 100_000; // Шаг для расчета (каждые 10k токенов)

      const datasets = Object.keys(lockPeriodParams).map((days) => {
        const params = lockPeriodParams[days];
        const dataPoints = [];

        for (let balance = 0; balance <= tokenBalanceMax; balance += stepSize) {
          const multiplier = Math.floor(balance / params.stepSize);
          const minusValue = multiplier * params.decrementStep;

          let rate =
            params.maxRate - minusValue > params.minRate
              ? params.maxRate - minusValue
              : params.minRate;

          dataPoints.push(rate / 100); // Преобразуем базисные пункты в проценты
        }

        return {
          label: `${days} days`,
          data: dataPoints,
          borderColor: getRandomColor(),
          borderWidth: 2,
          fill: false,
        };
      });

      const labels = Array.from(
        { length: tokenBalanceMax / stepSize + 1 },
        (_, i) => i * stepSize
      );

      setChartData({
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
  if (!chartData) {
    return <div>Loading...</div>;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: "Token Balance" },
        ticks: {
          callback: (value) => `${value / 100_000}k`, // Отображаем значения в формате "100k"
        },
        suggestedMin: 0,
        suggestedMax: 1_000_000,
      },
      y: {
        title: { display: true, text: "Interest Rate %" },
        suggestedMin: 0,
        suggestedMax: 200,
        ticks: {
          stepSize: 10, // Шаг сетки по вертикали (10%)
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      annotation: {
        annotations: [
          {
            type: "line",
            mode: "horizontal",
            scaleID: "y",
            value: 50, // Пример горизонтальной линии на уровне 50%
            borderColor: "red",
            borderWidth: 2,
            label: {
              content: "Target Rate",
              enabled: true,
              position: "end",
            },
          },
        ],
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Interest Rate Allocation</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default AllocationChart;