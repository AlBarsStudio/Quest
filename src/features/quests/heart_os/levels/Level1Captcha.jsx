import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Level1Captcha.module.css';

export default function Level1Captcha({ onNext, onSkip }) {
  // Фазы уровня: 'trap_start' -> 'trap_cooldown' -> 'paradox_buttons' -> 'stillness_test' -> 'success'
  const [subPhase, setSubPhase] = useState('trap_start');
  const [mountTime] = useState(Date.now());
  const [reactionMs, setReactionMs] = useState(0);

  // Фаза 1: Кулдаун
  const [cooldownTime, setCooldownTime] = useState(12);

  // Фаза 2: Кнопки-хамелеоны
  const [dodgeCount, setDodgeCount] = useState(0);
  const [chameleonPrompt, setChameleonPrompt] = useState(
    'Нажмите кнопку с зеленым текстом, если текущая секунда четная.'
  );
  const [btnPositions, setBtnPositions] = useState([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ]);
  const [showBypassDot, setShowBypassDot] = useState(false);

  // Фаза 3: Тест покоя
  const [stillnessTime, setStillnessTime] = useState(20);
  const [isDisturbed, setIsDisturbed] = useState(false);
  const [distractionActive, setDistractionActive] = useState(null); // 'tg_msg' | 'battery' | 'fly'
  const [flyPos, setFlyPos] = useState({ x: 40, y: 30 });
  const lastMousePos = useRef({ x: null, y: null });

  // -------------------------------------------------------------
  // ФАЗА 1: ЛОВУШКА СКОРОСТИ
  // -------------------------------------------------------------
  const handleTrapClick = () => {
    const timeSpent = Date.now() - mountTime;
    setReactionMs(timeSpent);
    setSubPhase('trap_cooldown');
  };

  // Таймер кулдауна
  useEffect(() => {
    if (subPhase !== 'trap_cooldown') return;
    const interval = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setSubPhase('paradox_buttons');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [subPhase]);

  // -------------------------------------------------------------
  // ФАЗА 2: ПАРАДОКСАЛЬНЫЕ КНОПКИ
  // -------------------------------------------------------------
  const dodgeButton = (index) => {
    const newCount = dodgeCount + 1;
    setDodgeCount(newCount);

    // Случайное смещение
    const randX = (Math.random() - 0.5) * 160;
    const randY = (Math.random() - 0.5) * 100;
    setBtnPositions((prev) => {
      const next = [...prev];
      next[index] = { x: randX, y: randY };
      return next;
    });

    const prompts = [
      'ОШИБКА: Правило аннулировано 0.2с назад. Нажмите кнопку, которую вы НЕ планировали жать.',
      'Ассистент: "Слишком предсказуемо! Попробуйте нажать кнопку, которая лжет."',
      'ВНИМАНИЕ: Смена вектора. Теперь выберите ту, где цвет фона НЕ совпадает со смыслом.',
      'Ассистент: "Я снова передумал. Все кнопки заблокированы. Ищите системную лазейку!"'
    ];
    setChameleonPrompt(prompts[newCount % prompts.length]);

    if (newCount >= 4) {
      setShowBypassDot(true);
    }
  };

  const handleBypassClick = () => {
    setSubPhase('stillness_test');
  };

  // -------------------------------------------------------------
  // ФАЗА 3: ТЕСТ НА ПОКОЙ (20 СЕКУНД)
  // -------------------------------------------------------------
  const triggerMovementPenalty = useCallback(() => {
    if (subPhase !== 'stillness_test') return;
    setIsDisturbed(true);
    setStillnessTime(20); // Сброс таймера
    setTimeout(() => setIsDisturbed(false), 800);
  }, [subPhase]);

  // Отслеживание любого движения мыши/пальца > 4px
  useEffect(() => {
    if (subPhase !== 'stillness_test') return;

    const handlePointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
      if (!clientX || !clientY) return;

      if (lastMousePos.current.x !== null) {
        const dist = Math.hypot(
          clientX - lastMousePos.current.x,
          clientY - lastMousePos.current.y
        );
        if (dist > 5) {
          triggerMovementPenalty();
        }
      }
      lastMousePos.current = { x: clientX, y: clientY };
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, [subPhase, triggerMovementPenalty]);

  // Таймер покоя
  useEffect(() => {
    if (subPhase !== 'stillness_test') return;
    const interval = setInterval(() => {
      setStillnessTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setSubPhase('success');
          setTimeout(() => onNext(), 1600);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [subPhase, onNext]);

  // Спавн отвлекающих раздражителей во время покоя
  useEffect(() => {
    if (subPhase !== 'stillness_test') return;

    // Всплывающее фейковое сообщение через 4 сек
    const t1 = setTimeout(() => setDistractionActive('tg_msg'), 4000);
    const t2 = setTimeout(() => setDistractionActive(null), 8500);

    // Фейковая батарея через 10 сек
    const t3 = setTimeout(() => setDistractionActive('battery'), 11000);
    const t4 = setTimeout(() => setDistractionActive(null), 15000);

    // Муха летает каждые 2 секунды
    const flyInterval = setInterval(() => {
      setFlyPos({
        x: Math.floor(Math.random() * 80) + 10,
        y: Math.floor(Math.random() * 70) + 15
      });
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearInterval(flyInterval);
    };
  }, [subPhase]);

  return (
    <div className={styles.levelWrapper}>
      {/* Кнопка пропуска для отладки */}
      <button className={styles.skipBtn} onClick={onSkip}>
        ПРОПУСТИТЬ ЭТАП ⏭
      </button>

      <div className={`${styles.mainCard} ${isDisturbed ? styles.cardGlitchShake : ''}`}>
        {/* Хедер этапа */}
        <div className={styles.cardHeader}>
          <div className={styles.stageTag}>
            <span className={styles.stageNumber}>01 / 05</span>
            <span className={styles.stageLabel}>ПРОТОКОЛ ИМПУЛЬСИВНОСТИ</span>
          </div>
          <div className={styles.aiStatusBadge}>
            <span className={styles.statusDot}></span>
            AI: ACTIVE_GASLIGHT
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ПОДФАЗА 1: ЛОВУШКА СКОРОСТИ                                  */}
        {/* ------------------------------------------------------------- */}
        {subPhase === 'trap_start' && (
          <div className={styles.contentBody}>
            <h2 className={styles.title}>Тест Первичной Идентификации</h2>
            <p className={styles.description}>
              Система безопасности требует подтверждения осознанности оператора. 
              Нажмите на кнопку ниже, чтобы разблокировать конфигуратор.
            </p>

            <div className={styles.trapBtnArea}>
              <button className={styles.trapBigBtn} onClick={handleTrapClick}>
                <span className={styles.btnIcon}>⚡</span>
                ПОДТВЕРДИТЬ СТАТУС ОПЕРАТОРА
              </button>
            </div>
            <div className={styles.hintMuted}>* Время реакции фиксируется миллисекундным таймером ядра.</div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ПОДФАЗА 1.2: ШТРАФ ЗА СПЕШКУ                                  */}
        {/* ------------------------------------------------------------- */}
        {subPhase === 'trap_cooldown' && (
          <div className={styles.contentBody}>
            <div className={styles.errorAlertBadge}>[ ОШИБКА: ИМПУЛЬСИВНОСТЬ 99.8% ]</div>
            <h2 className={styles.titleError}>Отказ в валидации: реакция {reactionMs}мс</h2>
            
            <div className={styles.dialogueSnippet}>
              <strong>HeartOS Daemon:</strong> «Грубейшая ошибка! Боты и скрипты кликают сразу. 
              Живой человек обязан сомневаться от 3 до 7 секунд. Вы действовали без колебаний! 
              Назначен принудительный штраф на охлаждение процессора.»
            </div>

            <div className={styles.cooldownBlock}>
              <div className={styles.cooldownNumbers}>
                ОХЛАЖДЕНИЕ КОНТУРОВ: <strong>{cooldownTime}c</strong>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${((12 - cooldownTime) / 12) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ПОДФАЗА 2: ПАРАДОКСАЛЬНЫЕ КНОПКИ                              */}
        {/* ------------------------------------------------------------- */}
        {subPhase === 'paradox_buttons' && (
          <div className={styles.contentBody}>
            <div className={styles.badgeWarn}>ДИЛЕММА ХАМЕЛЕОНА</div>
            <h2 className={styles.title}>Калибровка противоречий</h2>
            <p className={styles.paradoxPrompt}>{chameleonPrompt}</p>

            <div className={styles.chameleonGrid}>
              <button 
                className={`${styles.chamBtn} ${styles.btnRedBg}`}
                style={{ transform: `translate(${btnPositions[0].x}px, ${btnPositions[0].y}px)` }}
                onMouseEnter={() => dodgeButton(0)}
                onTouchStart={() => dodgeButton(0)}
              >
                ЗЕЛЕНАЯ
              </button>

              <button 
                className={`${styles.chamBtn} ${styles.btnBlueBg}`}
                style={{ transform: `translate(${btnPositions[1].x}px, ${btnPositions[1].y}px)` }}
                onMouseEnter={() => dodgeButton(1)}
                onTouchStart={() => dodgeButton(1)}
              >
                НЕ ТРОГАТЬ
              </button>

              <button 
                className={`${styles.chamBtn} ${styles.btnGreenBg}`}
                style={{ transform: `translate(${btnPositions[2].x}px, ${btnPositions[2].y}px)` }}
                onMouseEnter={() => dodgeButton(2)}
                onTouchStart={() => dodgeButton(2)}
              >
                НАЖМИ МЕНЯ
              </button>

              <button 
                className={`${styles.chamBtn} ${styles.btnYellowBg}`}
                style={{ transform: `translate(${btnPositions[3].x}px, ${btnPositions[3].y}px)` }}
                onMouseEnter={() => dodgeButton(3)}
                onTouchStart={() => dodgeButton(3)}
              >
                САША ПРАВ
              </button>
            </div>

            {showBypassDot && (
              <div className={styles.bypassArea}>
                <span className={styles.bypassText}>
                  Системный сбой логики ассистента: найдена точка обхода ➔
                </span>
                <button 
                  className={styles.secretBypassDot}
                  onClick={handleBypassClick}
                  title="Обходной контур"
                >
                  •
                </button>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ПОДФАЗА 3: ТЕСТ НА ПОКОЙ                                      */}
        {/* ------------------------------------------------------------- */}
        {subPhase === 'stillness_test' && (
          <div className={styles.contentBody}>
            <div className={styles.badgeCritical}>БИОМЕТРИЧЕСКИЙ СЕНСОР ПОКОЯ</div>
            <h2 className={styles.title}>Проверка самоконтроля</h2>
            <p className={styles.description}>
              Не двигайте курсор и не касайтесь экрана ровно <strong>20 секунд</strong>. 
              Любое колебание сбросит таймер.
            </p>

            <div className={styles.stillnessTimerBox}>
              <div className={styles.timerCircle}>
                <span className={styles.timerNum}>{stillnessTime}</span>
                <span className={styles.timerUnit}>СЕК</span>
              </div>
              {isDisturbed && (
                <div className={styles.penaltyBanner}>
                  ⚠️ ОБНАРУЖЕНО ДВИЖЕНИЕ! ТАЙМЕР СБРОШЕН!
                </div>
              )}
            </div>

            {/* Летающая пиксельная муха */}
            <div 
              className={styles.pixelFly}
              style={{ top: `${flyPos.y}%`, left: `${flyPos.x}%` }}
            >
              🪰
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* УСПЕХ ЭТАПА 1                                                 */}
        {/* ------------------------------------------------------------- */}
        {subPhase === 'success' && (
          <div className={styles.contentBody}>
            <div className={styles.successGlyph}>✓</div>
            <h2 className={styles.titleSuccess}>ЭТАП 1 ЗАВЕРШЕН</h2>
            <p className={styles.description}>
              Импульсивность снижена до допустимого уровня. 
              Снятие первичного контура блокировки...
            </p>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ФЕЙКОВЫЕ ОТВЛЕКАЮЩИЕ УВЕДОМЛЕНИЯ ВО ВРЕМЯ ПОКОЯ               */}
      {/* ------------------------------------------------------------- */}
      {distractionActive === 'tg_msg' && (
        <div className={styles.fakeTgPopup}>
          <div className={styles.popupAvatar}>А</div>
          <div className={styles.popupContent}>
            <div className={styles.popupName}>Саша (AlBars)</div>
            <div className={styles.popupText}>Насть, ты где? Срочно глянь, тут баг в билде! 😱</div>
          </div>
        </div>
      )}

      {distractionActive === 'battery' && (
        <div className={styles.fakeBatteryPopup}>
          <span className={styles.batteryIcon}>🪫</span>
          <div>
            <strong>Предупреждение системы:</strong> Низкий заряд (1%).
          </div>
        </div>
      )}
    </div>
  );
}
