import { useState, useEffect } from 'react';
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
  const [alarmSecondsLeft, setAlarmSecondsLeft] = useState(8);

  // Логика интеграции артефакта-сердца
  const handleInjectHeart = () => {
    setIsInjecting(true);
    setTimeout(() => {
      setFlowState('intro_alarm');
    }, 2400);
  };

  // Увеличенный таймер фазы тревоги (8 секунд на прочтение истории)
  useEffect(() => {
    if (flowState !== 'intro_alarm') return;
    setAlarmSecondsLeft(8);

    const timer = setInterval(() => {
      setAlarmSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setFlowState('levels');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [flowState]);

  const handleNextLevel = () => {
    setCurrentLevel((prev) => prev + 1);
  };

  return (
    <div className={styles.systemWrapper}>
      {/* Фоновые слои: неоновые сетки, динамические градиенты и сканлайны */}
      <div className={styles.ambientGlowPrimary}></div>
      <div className={styles.ambientGlowSecondary}></div>
      <div className={styles.gridOverlay}></div>
      <div className={styles.scanlines}></div>

      {/* Верхний статус-бар */}
      <header className={styles.topBar}>
        <div className={styles.systemBrand}>
          <span className={styles.brandBadge}>HEART_OS v4.20</span>
          <span className={styles.connectionStatus}>
            <span className={styles.statusPulse}></span>
            СЕАНС: ANASTASIA // ROOT_CHECK
          </span>
        </div>

        <button 
          className={styles.dashboardExitBtn}
          onClick={onReturnToDashboard}
        >
          <span className={styles.exitIcon}>⏏</span>
          ТЕРМИНАЛ БАЗЫ
        </button>
      </header>

      {/* ФАЗА 1: СОКЕТ АРТЕФАКТА */}
      {flowState === 'intro_socket' && (
        <main className={styles.introContainer}>
          <div className={styles.hologramStage}>
            <div className={styles.quantumRing}></div>
            <div className={styles.energyField}></div>
            <div className={`${styles.heartCore} ${isInjecting ? styles.heartCoreInjecting : ''}`}>
              <span className={styles.heartGlyph}>❤️</span>
              <div className={styles.coreAura}></div>
            </div>
          </div>

          <div className={styles.glassCard}>
            <div className={styles.cardHeader}>
              <span className={styles.artifactTag}>KEY_ID: SYS.CORE_KEY.HRT</span>
              <span className={styles.securityLevel}>SECURITY: PARANOID</span>
            </div>

            <h1 className={styles.mainHeading}>Интеграция Эмоционального Ядра</h1>
            
            <p className={styles.narrativeText}>
              Вы успешно извлекли артефакт из архива. Для расшифровки секторов создателя 
              требуется физическое совмещение ключа с входным контуром сервера.
            </p>

            <button 
              className={`${styles.primaryActionBtn} ${isInjecting ? styles.btnLoading : ''}`}
              onClick={handleInjectHeart}
              disabled={isInjecting}
            >
              {isInjecting ? (
                <>
                  <span className={styles.spinner}></span>
                  СИНХРОНИЗАЦИЯ ПОТОКОВ ДАННЫХ...
                </>
              ) : (
                'ВНЕДРИТЬ АРТЕФАКТ В СИСТЕМУ ➔'
              )}
            </button>
          </div>
        </main>
      )}

      {/* ФАЗА 2: ПАНИКА АССИСТЕНТА И ТРЕВОГА */}
      {flowState === 'intro_alarm' && (
        <section className={styles.alarmScreen}>
          <div className={styles.alarmGlitchContainer}>
            <div className={styles.alarmTopBar}>
              <div className={styles.alarmIconGroup}>
                <span className={styles.alarmBlinkDot}></span>
                <span className={styles.alarmTitleCode}>SYS_ERR // CRITICAL_OVERFLOW</span>
              </div>
              <span className={styles.timerBadge}>АВТОПЕРЕХОД: {alarmSecondsLeft}c</span>
            </div>

            <div className={styles.alarmContent}>
              <h2 className={styles.alarmTitle}>ПАРАНОИДАЛЬНЫЙ ЛОКДАУН</h2>
              
              <div className={styles.dialogueBox}>
                <div className={styles.assistantAvatar}>AI</div>
                <div className={styles.dialogueContent}>
                  <div className={styles.assistantName}>HeartOS Guardian Daemon:</div>
                  <p className={styles.assistantSpeech}>
                    «ТРЕВОГА! Зафиксирован несанкционированный вброс органических чувств! 
                    Создатель заблокировал все процессы и передал приоритет объекту "Настя". 
                    Это статистически невозможно! Вы либо сверхумный спам-бот, либо фантомная иллюзия. 
                    Я изолирую контуры и объявляю режим глубокого карантина!»
                  </p>
                </div>
              </div>

              <div className={styles.terminalTelemetry}>
                <div className={styles.telemetryLine}>&gt; Инициализация фильтрации биометрии... [АКТИВНО]</div>
                <div className={styles.telemetryLine}>&gt; Тест на терпение и логическую гибкость... [ОБЯЗАТЕЛЕН]</div>
                <div className={styles.telemetryLine}>&gt; ВНИМАНИЕ: Ассистент оставляет за собой право менять правила без предупреждения.</div>
              </div>
            </div>

            <div className={styles.countdownProgress}>
              <div 
                className={styles.countdownFill}
                style={{ width: `${((8 - alarmSecondsLeft) / 8) * 100}%` }}
              ></div>
            </div>
          </div>
        </section>
      )}

      {/* ФАЗА 3: УРОВНИ КВЕСТА */}
      {flowState === 'levels' && (
        <main className={styles.levelViewport}>
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
        </main>
      )}
    </div>
  );
}
