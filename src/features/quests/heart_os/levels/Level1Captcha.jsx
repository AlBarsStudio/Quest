import { useState } from 'react';
import styles from './Level1Captcha.module.css';

export default function Level1Captcha({ onNext }) {
  const [clicks, setClicks] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleBoxClick = () => {
    if (clicks < 3) {
      setClicks(prev => prev + 1);
    }
  };

  const handleSecretClick = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onNext();
    }, 2000); // Показываем галочку 2 секунды, потом идем дальше
  };

  // Вычисляем количество квадратиков: 1 -> 2 -> 4 -> 8
  const boxCount = Math.pow(2, clicks);
  const boxes = Array.from({ length: boxCount });

  if (isSuccess) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.hugeCheckmark}>✔</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.bureaucracyText}>
        <p>{">"} HeartOS v.09.06 // Модуль верификации</p>
        <p>{">"} Для инициализации процесса верификации субъекта "Настя", подтвердите отсутствие вредоносных намерений по отношению к Администратору сервера.</p>
      </div>

      <div className={styles.captchaWrapper}>
        <span className={styles.captchaLabel}>Я не робот, я Настя:</span>
        <div className={styles.boxesContainer} data-clicks={clicks}>
          {boxes.map((_, index) => (
            <div
              key={index}
              className={styles.checkbox}
              onClick={handleBoxClick}
            />
          ))}
        </div>
      </div>

      {clicks >= 3 && (
        <div className={styles.secretText} onClick={handleSecretClick}>
          Признать себя любимой девушкой без бюрократии
        </div>
      )}
    </div>
  );
}
