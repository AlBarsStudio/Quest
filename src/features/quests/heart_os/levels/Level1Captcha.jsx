import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './Level1Captcha.module.css';

const DODGE_PHRASES = [
  "Я не робот",
  "Ой, мимо! 💨",
  "Слишком медленно ⚡",
  "Саша, спасай! 🏃‍♀️",
  "Капибара протестует 🦫",
  "Калибровка пульса... ❤️",
  "Почти... но нет! ✨",
  "Ладно, я сдаюсь! Нажимай!"
];

export default function Level1Captcha({ onNext, onSkip }) {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 });
  const [isTired, setIsTired] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState(DODGE_PHRASES[0]);
  
  // Мобильная виртуальная мышь
  const [virtualMouse, setVirtualMouse] = useState({ x: null, y: null, active: false });
  const containerRef = useRef(null);
  const boxRef = useRef(null);

  // Перемещение кнопки в случайную безопасную координату
  const triggerDodge = useCallback(() => {
    if (isTired || isVerified) return;

    const nextCount = dodgeCount + 1;
    setDodgeCount(nextCount);

    if (nextCount >= 7) {
      setIsTired(true);
      setCurrentPhrase(DODGE_PHRASES[7]);
      return;
    }

    setCurrentPhrase(DODGE_PHRASES[nextCount % DODGE_PHRASES.length]);

    // Вычисляем границы контейнера для безопасного побега
    const bounds = containerRef.current?.getBoundingClientRect();
    const maxX = bounds ? bounds.width / 2 - 90 : 130;
    const maxY = bounds ? bounds.height / 2 - 80 : 100;

    const randX = (Math.random() - 0.5) * 2 * maxX;
    const randY = (Math.random() - 0.5) * 2 * maxY;

    setButtonPos({ x: randX, y: randY });
  }, [dodgeCount, isTired, isVerified]);

  // Финальный успешный клик
  const handleCheck = () => {
    if (!isTired && dodgeCount < 7) {
      triggerDodge();
      return;
    }
    setIsVerified(true);
    setTimeout(() => {
      onNext();
    }, 1800);
  };

  // Обработка тач-событий на мобильных устройствах с визуальным виртуальным курсором
  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    if (!touch || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    setVirtualMouse({ x: touchX, y: touchY, active: true });

    // Проверка дистанции до кнопки для уклонения на тачскрине
    if (boxRef.current && !isTired) {
      const boxRect = boxRef.current.getBoundingClientRect();
      const boxCenterX = boxRect.left + boxRect.width / 2;
      const boxCenterY = boxRect.top + boxRect.height / 2;

      const dist = Math.hypot(touch.clientX - boxCenterX, touch.clientY - boxCenterY);
      if (dist < 85) {
        triggerDodge();
      }
    }
  };

  const handleTouchEnd = () => {
    setVirtualMouse(prev => ({ ...prev, active: false }));
  };

  return (
    <div 
      className={styles.levelWrapper}
      ref={containerRef}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Кнопка пропуска для тестирования */}
      <button className={styles.skipBtn} onClick={onSkip}>
        ПРОПУСТИТЬ УРОВЕНЬ ⏭
      </button>

      {/* Виртуальный курсор при управлении пальцем на телефоне */}
      {virtualMouse.active && (
        <div 
          className={styles.virtualCursor}
          style={{ transform: `translate(${virtualMouse.x}px, ${virtualMouse.y}px)` }}
        >
          <div className={styles.cursorPointer}></div>
          <span className={styles.cursorLabel}>TOUCH_EMULATOR</span>
        </div>
      )}

      <div className={styles.captchaWindow}>
        <div className={styles.windowHeader}>
          <div className={styles.headerDots}>
            <span className={styles.dotRed}></span>
            <span className={styles.dotYellow}></span>
            <span className={styles.dotGreen}></span>
          </div>
          <div className={styles.headerTitle}>HeartOS Security Gate // Stage 1 of 5</div>
        </div>

        <div className={styles.windowBody}>
          <div className={styles.badgeInfo}>ПРОВЕРКА НА БОТА</div>
          <h2 className={styles.mainTitle}>Биометрический тест реакции</h2>
          <p className={styles.subTitle}>
            Система фиксирует подозрительную концентрацию милоты. 
            Подтвердите свой статус человека нажатием в чекбокс.
          </p>

          <div className={styles.captchaContainerArea}>
            <div 
              ref={boxRef}
              className={`${styles.reCaptchaBox} ${isVerified ? styles.boxSuccess : ''}`}
              style={{
                transform: `translate(${buttonPos.x}px, ${buttonPos.y}px)`,
                transition: isTired ? 'transform 0.4s ease' : 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              onMouseEnter={triggerDodge}
            >
              <button 
                type="button"
                className={`${styles.checkbox} ${isVerified ? styles.checked : ''}`}
                onClick={handleCheck}
                aria-label="Подтвердить статус"
              >
                {isVerified && <span className={styles.checkmarkIcon}>✓</span>}
              </button>

              <span className={styles.captchaLabel}>
                {isVerified ? "ЧЕЛОВЕК ВЕРИФИЦИРОВАН" : currentPhrase}
              </span>

              <div className={styles.reCaptchaLogo}>
                <div className={styles.logoIcon}>🔒</div>
                <div className={styles.logoText}>
                  <span>HeartCAPTCHA</span>
                  <small>Privacy • Terms</small>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.statsBar}>
            <span className={styles.statsItem}>
              ПОПЫТОК ПОИМАТЬ: <strong>{dodgeCount}/7</strong>
            </span>
            <span className={styles.statsItem}>
              СТАТУС: <strong>{isTired ? 'КНОПКА УСТАЛА' : isVerified ? 'УСПЕХ' : 'УБЕГАЕТ'}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
