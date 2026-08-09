import { useState, useEffect } from 'react';
import styles from './Level5Final.module.css';

export default function Level5Final({ onNext }) {
  const [chaos, setChaos] = useState(true);
  const [timer, setTimer] = useState(12);

  useEffect(() => {
    if (!chaos) return;

    let timeout;
    const handleMouseMove = () => {
      setTimer(12); // Сброс таймера при движении
      clearTimeout(timeout);
      
      timeout = setTimeout(() => {
        setChaos(false);
      }, 12000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Запуск первичного таймера
    timeout = setTimeout(() => {
      setChaos(false);
    }, 12000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [chaos]);

  const buttons = Array.from({ length: 40 });

  if (!chaos) {
    return (
      <div className={styles.peaceScreen}>
        <div className={styles.heartContainer} onClick={onNext}>
          <div className={styles.heart}>Войти</div>
        </div>
        <p className={styles.peaceText}>
          Иногда, чтобы всё починить, нужно просто остановиться, выдохнуть и довериться мне.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.chaosContainer}>
      <div className={styles.alertScreen}>
        <h1>ДОСТУП ЗАПРЕЩЕН</h1>
        <p>КРИТИЧЕСКИЙ СБОЙ ВЕРИФИКАЦИИ</p>
        <p className={styles.timerStr}>Ожидание тишины: {timer}с</p>
      </div>

      {buttons.map((_, i) => (
        <button 
          key={i} 
          className={styles.crazyBtn}
          style={{
            top: `${Math.random() * 90}%`,
            left: `${Math.random() * 90}%`,
            animationDelay: `${Math.random()}s`
          }}
          onMouseEnter={(e) => {
             e.target.style.top = `${Math.random() * 90}%`;
             e.target.style.left = `${Math.random() * 90}%`;
          }}
        >
          Завершить
        </button>
      ))}
    </div>
  );
}
