import React, { useState } from "react";

const HelpTooltip = ({ text }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  // Функция для показа/скрытия подсказки
  const toggleTooltip = () => {
    setIsTooltipVisible(!isTooltipVisible);
  };

  // Обработчик клика вне компонента
  const handleClickOutside = (event) => {
    if (!isTooltipVisible) return;
    setIsTooltipVisible(false);
  };

  return (
    <div className="relative inline-block">
      {/* Значок вопроса */}
      <button
        onClick={toggleTooltip}
        className="text-blue-500 hover:text-blue-700"
      >
        (?)
      </button>

      {/* Подсказка */}
      {isTooltipVisible && (
        <>
          <div className="fixed bg-white opacity-0 z-10 left-0 top-0 bottom-0 right-0" onClick={() => { setIsTooltipVisible(false) }}></div>
          <div
          className="absolute z-10 bg-yellow bg-yellow-50 bottom-full border border-blue-500 rounded-lg shadow-md p-4 min-w-[300px]"
            style={{ marginLeft: '-150px' }}
          >
            <p>{text}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default HelpTooltip;