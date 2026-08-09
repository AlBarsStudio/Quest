import { useState } from 'react';
import Level1Captcha from './levels/Level1Captcha';
import Level2Captcha from './levels/Level2Captcha';
import Level3Cookies from './levels/Level3Cookies';
import Level4Password from './levels/Level4Password';
import Level5Final from './levels/Level5Final';
import styles from './HeartOSFlow.module.css';

export default function HeartOSFlow({ onReturnToDashboard }) {
  const [currentLevel, setCurrentLevel] = useState(1);

  const handleNextLevel = () => {
    setCurrentLevel(prev => prev + 1);
  };

  const handleComplete = () => {
    // В будущем здесь будет переход в профиль Насти
    onReturnToDashboard();
  };

  return (
    <div className={styles.systemWrapper}>
      <div className={styles.scanlines}></div>
      
      <div className={styles.levelContainer}>
        {currentLevel === 1 && <Level1Captcha onNext={handleNextLevel} />}
        {currentLevel === 2 && <Level2Captcha onNext={handleNextLevel} />}
        {currentLevel === 3 && <Level3Cookies onNext={handleNextLevel} />}
        {currentLevel === 4 && <Level4Password onNext={handleNextLevel} />}
        {currentLevel === 5 && <Level5Final onNext={handleComplete} />}
      </div>
    </div>
  );
}
