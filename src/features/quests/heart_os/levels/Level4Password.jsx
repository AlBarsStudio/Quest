import { useState, useEffect, useRef, useMemo } from 'react';
import styles from './Level4Password.module.css';

// Набор правил для Password Game
const PASSWORD_RULES = [
  {
    id: 1,
    label: 'Правило 1',
    desc: 'Пароль должен содержать не менее 8 символов.',
    check: (pw) => pw.length >= 8
  },
  {
    id: 2,
    label: 'Правило 2',
    desc: 'Пароль должен содержать день рождения оператора (число 20).',
    check: (pw) => pw.includes('20')
  },
  {
    id: 3,
    label: 'Правило 3',
    desc: 'Пароль должен содержать имя Создателя («Саша» или «Aleksandr»).',
    check: (pw) => /Саша|саша|Aleksandr|aleksandr/i.test(pw)
  },
  {
    id: 4,
    label: 'Правило 4',
    desc: 'Пароль должен содержать римскую цифру V или X.',
    check: (pw) => /[VX]/.test(pw)
  },
  {
    id: 5,
    label: 'Правило 5',
    desc: 'Сумма всех арабских цифр в пароле должна быть строго равна 24.',
    check: (pw) => {
      const digits = pw.match(/\d/g);
      if (!digits) return false;
      const sum = digits.reduce((acc, d) => acc + parseInt(d, 10), 0);
      return sum === 24;
    }
  },
  {
    id: 6,
    label: 'Правило 6',
    desc: 'Пароль должен содержать эмодзи искренних чувств (❤️).',
    check: (pw) => pw.includes('❤️')
  },
  {
    id: 7,
    label: 'Правило 7',
    desc: 'Пароль не должен содержать пробелов.',
    check: (pw) => pw.length > 0 && !/\s/.test(pw)
  }
];

export default function Level4Password({ onNext, onSkip }) {
  // Подфазы: 'password_game' -> 'rotation_2fa' -> 'success'
  const [subPhase, setSubPhase] = useState('password_game');

  // ФАЗА 1: ПАРОЛЬНЫЙ АД
  const [password, setPassword] = useState('');
  const [visibleRulesCount, setVisibleRulesCount] = useState(1);
  const [hasBug, setHasBug] = useState(false);
  const [bugEatenCount, setBugEatenCount] = useState(0);

  // ФАЗА 2: 2FA РОТАЦИЯ ГОРИЗОНТА
  const [rotationAngle, setRotationAngle] = useState(135);
  const [rotationAlert, setRotationAlert] = useState('');
  const [isRotating, setIsRotating] = useState(false);
  const [targetAngleHold, setTargetAngleHold] = useState(0);

  // Вычисление суммы цифр для подсказки
  const currentDigitsSum = useMemo(() => {
    const digits = password.match(/\d/g);
    if (!digits) return 0;
    return digits.reduce((acc, d) => acc + parseInt(d, 10), 0);
  }, [password]);

  // -------------------------------------------------------------
  // ЛОГИКА PASSWORD GAME
  // -------------------------------------------------------------
  useEffect(() => {
    if (subPhase !== 'password_game') return;

    let passedCount = 0;
    for (let i = 0; i < PASSWORD_RULES.length; i++) {
      if (PASSWORD_RULES[i].check(password)) {
        passedCount = i + 1;
      } else {
        break;
      }
    }
    setVisibleRulesCount(Math.min(PASSWORD_RULES.length, Math.max(1, passedCount + 1)));

    const allPassed = PASSWORD_RULES.every(r => r.check(password));
    if (allPassed && !hasBug) {
      setTimeout(() => {
        setSubPhase('rotation_2fa');
      }, 1200);
    }
  }, [password, subPhase, hasBug]);

  // Спавн бага-пожирателя символов каждые 14 секунд
  useEffect(() => {
    if (subPhase !== 'password_game') return;

    const bugTimer = setInterval(() => {
      if (password.length > 3) {
        setHasBug(true);
      }
    }, 14000);

    return () => clearInterval(bugTimer);
  }, [subPhase, password.length]);

  // Пожирание символа, если баг не уничтожен
  useEffect(() => {
    if (!hasBug) return;

    const eatTimer = setTimeout(() => {
      setPassword(prev => {
        if (prev.length > 0) {
          setBugEatenCount(c => c + 1);
          return prev.slice(0, -1);
        }
        return prev;
      });
      setHasBug(false);
    }, 4500);

    return () => clearTimeout(eatTimer);
  }, [hasBug]);

  const handleSquashBug = () => {
    setHasBug(false);
  };

  // -------------------------------------------------------------
  // ЛОГИКА 2FA РОТАЦИИ (Нужно выставить ровно -7 градусов)
  // -------------------------------------------------------------
  const handleAngleChange = (e) => {
    const angle = parseInt(e.target.value, 10);
    setRotationAngle(angle);

    if (angle === 0) {
      setRotationAlert('«0° — это неестественный идеальный перфекционизм! Картины в жизни висят с наклоном -7°!»');
      setTargetAngleHold(0);
    } else if (angle >= -8 && angle <= -6) {
      setRotationAlert('ЕСТЕСТВЕННЫЙ УГОЛ НАЙДЕН (-7°)! УДЕРЖИВАЙТЕ...');
    } else {
      setRotationAlert(angle < -7 ? 'Слишком сильный крен влево!' : 'Слишком сильный крен вправо!');
      setTargetAngleHold(0);
    }
  };

  // Таймер удержания угла -7°
  useEffect(() => {
    if (subPhase !== 'rotation_2fa') return;

    let interval = null;
    const isTarget = rotationAngle >= -8 && rotationAngle <= -6;

    if (isTarget) {
      interval = setInterval(() => {
        setTargetAngleHold(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setSubPhase('success');
            setTimeout(() => onNext(), 1800);
            return 100;
          }
          return prev + 5; // ~2 секунды
        });
      }, 100);
    } else {
      setTargetAngleHold(0);
    }

    return () => clearInterval(interval);
  }, [rotationAngle, subPhase, onNext]);

  return (
    <div className={styles.levelWrapper}>
      {/* Кнопка пропуска */}
      <button className={styles.skipBtn} onClick={onSkip}>
        ПРОПУСТИТЬ ЭТАП ⏭
      </button>

      <div className={styles.mainCard}>
        {/* Хедер этапа */}
        <div className={styles.cardHeader}>
          <div className={styles.stageTag}>
            <span className={styles.stageNumber}>04 / 05</span>
            <span className={styles.stageLabel}>ПРОТОКОЛ ГЕНЕРАЦИИ МАСТЕР-ПАРОЛЯ</span>
          </div>
          <div className={styles.aiStatusBadge}>
            <span className={styles.statusDot}></span>
            AI: PASSWORD_PARANOIA
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ПОДФАЗА 1: PASSWORD GAME                                      */}
        {/* ------------------------------------------------------------- */}
        {subPhase === 'password_game' && (
          <div className={styles.contentBody}>
            <div className={styles.badgeWarn}>КРИПТОГРАФИЧЕСКИЙ СИНТЕЗ</div>
            <h2 className={styles.title}>Создание Мастер-Ключа</h2>
            <p className={styles.description}>
              Сгенерируйте пароль, удовлетворяющий всем требованиям алгоритма. 
              Правила открываются по мере их выполнения.
            </p>

            {/* Поле ввода пароля с кнопками быстрой вставки */}
            <div className={styles.inputAreaWrapper}>
              <div className={styles.inputBox}>
                <input 
                  type="text"
                  className={styles.passwordInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль..."
                  autoFocus
                />
                <div className={styles.quickActions}>
                  <button 
                    type="button"
                    className={styles.quickBtn}
                    onClick={() => setPassword(p => p + '❤️')}
                    title="Вставить ❤️"
                  >
                    +❤️
                  </button>
                  <button 
                    type="button"
                    className={styles.quickBtn}
                    onClick={() => setPassword(p => p + 'V')}
                    title="Вставить V"
                  >
                    +V
                  </button>
                  <button 
                    type="button"
                    className={styles.quickBtn}
                    onClick={() => setPassword(p => p + '20')}
                    title="Вставить 20"
                  >
                    +20
                  </button>
                </div>
              </div>

              {/* Баг-пожиратель */}
              {hasBug && (
                <div className={styles.bugBanner} onClick={handleSquashBug}>
                  <span className={styles.bugIcon}>🐛</span>
                  <div className={styles.bugText}>
                    <strong>КРИТИЧЕСКИЙ БАГ!</strong> Он съест символ через 4 секунды! ЖМИТЕ СЮДА, ЧТОБЫ РАЗДАВИТЬ!
                  </div>
                </div>
              )}
            </div>

            {/* Метрики и подсказки */}
            <div className={styles.metricsBar}>
              <span>Сумма цифр: <strong>{currentDigitsSum}</strong> / 24</span>
              <span>Длина: <strong>{password.length}</strong></span>
              {bugEatenCount > 0 && <span className={styles.bugCounter}>Съедено багом: {bugEatenCount}</span>}
            </div>

            {/* Список правил */}
            <div className={styles.rulesList}>
              {PASSWORD_RULES.slice(0, visibleRulesCount).map((rule) => {
                const passed = rule.check(password);
                return (
                  <div 
                    key={rule.id}
                    className={`${styles.ruleCard} ${passed ? styles.ruleCardPassed : styles.ruleCardFailed}`}
                  >
                    <div className={styles.ruleStatusIcon}>
                      {passed ? '✓' : '✕'}
                    </div>
                    <div className={styles.ruleInfo}>
                      <div className={styles.ruleLabel}>{rule.label}</div>
                      <div className={styles.ruleDesc}>{rule.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ПОДФАЗА 2: 2FA РОТАЦИЯ ГОРИЗОНТА                              */}
        {/* ------------------------------------------------------------- */}
        {subPhase === 'rotation_2fa' && (
          <div className={styles.contentBody}>
            <div className={styles.badgeStage}>2FA КАЛИБРОВКА ГОРИЗОНТА</div>
            <h2 className={styles.title}>Биометрическая Ротация</h2>
            <p className={styles.description}>
              Пароль принят! Для завершения 2FA выровняйте угол наклона картины. 
              Установите естественный наклон (<strong>-7°</strong>).
            </p>

            <div className={styles.rotationStage}>
              <div 
                className={styles.imageFrame}
                style={{ transform: `rotate(${rotationAngle}deg)` }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80" 
                  alt="2FA Verification Target"
                  className={styles.targetCatImg}
                />
                <div className={styles.crosshairGrid}></div>
              </div>
            </div>

            <div className={styles.angleDisplay}>
              ТЕКУЩИЙ УГОЛ: <span className={styles.angleValue}>{rotationAngle}°</span>
            </div>

            <div className={styles.sliderWrapper}>
              <input 
                type="range"
                min="-180"
                max="180"
                value={rotationAngle}
                onChange={handleAngleChange}
                className={styles.angleSlider}
              />
            </div>

            {rotationAlert && (
              <div className={styles.rotationAlertBox}>
                {rotationAlert}
              </div>
            )}

            {/* Прогресс-бар удержания угла */}
            <div className={styles.holdProgressBox}>
              <div className={styles.holdProgressLabel}>
                СИНХРОНИЗАЦИЯ ГОРИЗОНТА: <strong>{targetAngleHold}%</strong>
              </div>
              <div className={styles.holdProgressTrack}>
                <div 
                  className={styles.holdProgressFill}
                  style={{ width: `${targetAngleHold}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* УСПЕХ ЭТАПА 4                                                 */}
        {/* ------------------------------------------------------------- */}
        {subPhase === 'success' && (
          <div className={styles.contentBody}>
            <div className={styles.successGlyph}>✓</div>
            <h2 className={styles.titleSuccess}>МАСТЕР-КЛЮЧ АВТОРИЗОВАН</h2>
            <p className={styles.description}>
              Криптографический хэш совпал на 100%. 2FA горизонт стабилизирован. 
              Переход к финальному краш-тесту осциллографа...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
