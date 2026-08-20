import { useState } from 'react';
import Level1Captcha from './levels/Level1Captcha';
import Level2Captcha from './levels/Level2Captcha';
import Level3Cookies from './levels/Level3Cookies';
import Level4Password from './levels/Level4Password';
import Level5Final from './levels/Level5Final';
import styles from './HeartOSFlow.module.css';

export default function HeartOSFlow({ onReturnToDashboard }) {
  // 'intro_socket' -> 'intro_alarm' -> 'levels'
  const [flowState, setFlowState] = useState('intro_socket');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isInjecting, setIsInjecting] = useState(false);

  const handleInjectHeart = () => {
    setIsInjecting(true);
    setTimeout(() => {
      setFlowState('intro_alarm');
      setTimeout(() => {
        setFlowState('levels');
      }, 3800);
    }, 2000);
  };

  const handleNextLevel = () => {
    setCurrentLevel((prev) => prev + 1);
  };

  return (
    <div className={styles.systemWrapper}>
      <div className={styles.scanlines}></div>
      <div className={styles.vignette}></div>

      {/* Кнопка экстренного выхода в дашборд */}
      <button 
        className={styles.dashboardExitBtn}
        onClick={onReturnToDashboard}
      >
        ✕ ВЕРНУТЬСЯ НА БАЗУ
      </button>

      {/* ФАЗА 0.1: ВНЕДРЕНИЕ СЕРДЦА-КЛЮЧА */}
      {flowState === 'intro_socket' && (
        <div className={styles.introContainer}>
          <div className={styles.hologramSocket}>
            <div className={`${styles.heartArtifact} ${isInjecting ? styles.heartInjecting : ''}`}>
              ❤️
            </div>
            <div className={styles.socketRing}></div>
            <div className={styles.socketParticles}></div>
          </div>

          <div className={styles.introCard}>
            <div className={styles.cardBadge}>АРТЕФАКТ: SYS.CORE_KEY.HRT</div>
            <h1 className={styles.introTitle}>Синхронизация Ядра</h1>
            <p className={styles.introDesc}>
              Вы извлекли ключ шифрования из защищенного хранилища. 
              Требуется ручная интеграция био-протокола в системный слот.
            </p>
            
            <button 
              className={styles.injectButton}
              onClick={handleInjectHeart}
              disabled={isInjecting}
            >
              {isInjecting ? '[ ИНИЦИАЛИЗАЦИЯ ИНЪЕКЦИИ... ]' : '⚡ ВНЕДРИТЬ КЛЮЧ В ЯДРО'}
            </button>
          </div>
        </div>
      )}

      {/* ФАЗА 0.2: СБОЙ СИСТЕМЫ И ПАНИКА АССИСТЕНТА */}
      {flowState === 'intro_alarm' && (
        <div className={styles.alarmOverlay}>
          <div className={styles.alarmGlitchBox}>
            <div className={styles.alarmTag}>[ CRITICAL_SECURITY_BREACH ]</div>
            <h2 className={styles.alarmHeading}>ОТКАЗ В ДОСТУПЕ: СБОЙ ЛОГИКИ</h2>
            <p className={styles.alarmLog}>
              &gt; ОБНАРУЖЕНА НЕИЗВЕСТНАЯ ЭМОЦИОНАЛЬНАЯ СИГНАТУРА...<br/>
              &gt; АССИСТЕНТ: "Создатель не мог передать root-права стороннему объекту!"<br/>
              &gt; ПРОТОКОЛ HeartOS: ПРИНУДИТЕЛЬНАЯ КАЛИБРОВКА ЧЕЛОВЕЧНОСТИ.
            </p>
            <div className={styles.alarmProgress}>
              <div className={styles.alarmProgressBar}></div>
            </div>
          </div>
        </div>
      )}

      {/* ФАЗА 1-5: УРОВНИ КАПЧИ И BAD-UX */}
      {flowState === 'levels' && (
        <div className={styles.levelContainer}>
          {currentLevel === 1 && (
            <Level1Captcha 
              onNext={handleNextLevel} 
              onSkip={handleNextLevel} 
            />
          )}
          {currentLevel === 2 && (
            <Level2Captcha 
              onNext={handleNextLevel} 
              onSkip={handleNextLevel} 
            />
          )}
          {currentLevel === 3 && (
            <Level3Cookies 
              onNext={handleNextLevel} 
              onSkip={handleNextLevel} 
            />
          )}
          {currentLevel === 4 && (
            <Level4Password 
              onNext={handleNextLevel} 
              onSkip={handleNextLevel} 
            />
          )}
          {currentLevel === 5 && (
            <Level5Final 
              onNext={onReturnToDashboard} 
              onSkip={onReturnToDashboard} 
            />
          )}
        </div>
      )}
    </div>
  );
}
