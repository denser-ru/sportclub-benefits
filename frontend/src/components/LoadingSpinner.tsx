import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    // Добавляем role="status" для объявления статуса загрузки
    // aria-live="polite" сообщит скринридеру об изменении, когда он закончит текущие задачи
    <div role="status" aria-live="polite">
      Загрузка...
    </div>
  );
};

export default LoadingSpinner;