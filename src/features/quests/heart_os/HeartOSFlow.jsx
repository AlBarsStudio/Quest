import { useState } from 'react';
import Level1Captcha from './levels/Level1Captcha';
import styles from './HeartOSFlow.module.css';

export default function HeartOSFlow({ onReturnToDashboard }) {
  // Уровни: 1 - Капча фрактальная, 2 - Пятнашки, 3 - Окна и т.д.
  const [currentLevel, setCurrentLevel] = useState(1);

  const handleNextLevel = () => {
    setCurrentLevel(prev => prev + 1);
  };

  return (
    <div className={styles.systemWrapper}>
      <div className={styles.scanlines}></div>
      
      <div className={styles.levelContainer}>
        {currentLevel === 1 && (
          <Level1Captcha onNext={handleNextLevel} />
        )}
        
        {currentLevel === 2 && (
          <div className={styles.placeholder}>
            <h2>Уровень 2: Пятнашки</h2>
            <p>В разработке...</p>
            <button onClick={onReturnToDashboard} className={styles.returnBtn}>
              Вернуться в дашборд
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
