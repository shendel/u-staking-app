import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useState, useEffect } from "react";

// Создаем контекст для модального окна
const ConfirmationModalContext = createContext({
  openModal: () => {},
  closeModal: () => {}
});

// Хук для доступа к контексту
export const useConfirmationModal = () => {
  return useContext(ConfirmationModalContext);
};


// Компонент модального окна
export default function ConfirmationModal({ children }) {
  const [isOpened, setIsOpened] = useState(false);
  const [modalData, setModalData] = useState({
    title: "Confirm Action",
    description: "Are you sure?",
    okTitle: "Confirm",
    cancelTitle: "Cancel",
    onConfirm: null,
    onCancel: null,
    isAlert: false,
    content: null,
    hideBottomButtons: false,
    hideClose: false,
    fullWidth: false,
  });

  // Отложенное обновление состояния через useEffect
  const [pendingOpen, setPendingOpen] = useState(false); // Флаг для отложенного открытия
  const [options, setOptions] = useState(null); // Хранилище параметров модального окна

  useEffect(() => {
    if (pendingOpen && options) {
      setModalData({
        title: options.title || "Confirm Action",
        description: options.description || "Are you sure?",
        okTitle: options.okTitle || "Confirm",
        cancelTitle: options.cancelTitle || "Cancel",
        onConfirm: options.onConfirm || null,
        onCancel: options.onCancel || null,
        isAlert: options.isAlert || false,
        content: options.content || null,
        hideBottomButtons: options.hideBottomButtons || false,
        hideCloseButton: options.hideCloseButton || false,
        fullWidth: options.fullWidth || false
      });
      setIsOpened(true); // Безопасно открываем окно после завершения рендера
      setPendingOpen(false); // Сбрасываем флаг
    }
  }, [pendingOpen, options]);

  // Функция для открытия модального окна
  const openModal = (options) => {
    setOptions(options); // Сохраняем параметры
    setPendingOpen(true); // Устанавливаем флаг для отложенного открытия
  };

  // Обработчики кнопок
  const handleConfirm = () => {
    if (modalData.onConfirm) modalData.onConfirm(); // Выполняем callback при подтверждении
    setIsOpened(false); // Закрываем окно
  };

  const handleCancel = () => {
    if (modalData.onCancel) modalData.onCancel(); // Выполняем callback при отмене
    setIsOpened(false); // Закрываем окно
  };
  const closeModal = (callbacks) => {
    const { doCancel, doConfirm, data = false} = callbacks
    if (doConfirm && modalData.onConfirm) modalData.onConfirm(data); // Выполняем callback при подтверждении
    if (doCancel && modalData.onCancel) modalData.onCancel(data); // Выполняем callback при отмене
    setIsOpened(false)
  }
  return (
    <ConfirmationModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {/* Анимированный показ/скрытие модального окна */}
      <AnimatePresence>
        {isOpened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            {/* Основной контейнер модального окна */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`bg-white rounded-lg p-6 shadow-lg w-full ${(modalData.fullWidth) ? 'max-w-4xl' : 'max-w-md'} relative`}
            >
              {/* Заголовок */}
              <h2 className="text-2xl font-bold text-center mb-4">{modalData.title}</h2>
            
              
              {modalData.content == null ? (
                <div className="text-gray-700 text-center mb-6">
                  {modalData.description}
                </div>
              ) : (
                <div>
                  {modalData.content}
                </div>
              )}
              
              {!modalData.hideBottomButtons && (
                <>
                  {modalData.isAlert ? (
                    <div className="grid place-items-center">
                      <button
                        onClick={handleCancel}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        {modalData.okTitle || "Ok"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={handleCancel}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        {modalData.cancelTitle || "Cancel"}
                      </button>
                      <button
                        onClick={handleConfirm}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        {modalData.okTitle || "Confirm"}
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Кнопка закрытия */}
              {!modalData.hideCloseButton && (
                <button
                  onClick={handleCancel}
                  className="absolute top-2 right-2 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500 hover:text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmationModalContext.Provider>
  );
}