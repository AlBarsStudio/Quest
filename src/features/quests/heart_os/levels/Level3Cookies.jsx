import { useState, useRef } from 'react';
import styles from './Level3Cookies.module.css';

const COOKIE_SETTINGS = [
  { id: 'c1', label: 'Обязательные: Сохранять влюбленный взгляд', defaultVal: true, locked: true },
  { id: 'c2', label: 'Маркетинг: Напоминания купить вкусняшки в 23:00', defaultVal: false, locked: false },
  { id: 'c3', label: 'Производительность: Фоновый рендер будущих планов', defaultVal: true, locked: false },
  { id: 'c4', label: 'Трекинг: Фиксация частоты объятий (мин. 10 раз/день)', defaultVal: false, locked: false },
  { id: 'c5', label: 'Нейросеть: Автоматическое согласие на просмотр сериала', defaultVal: false, locked: false },
  { id: 'c6', label: 'ROOT_ACCESS: Отключить паранойю ИИ и впустить Настю', defaultVal: false, locked: false, isKey: true },
  { id: 'c7', label: 'Аналитика: Подсчет съеденных капибарами нервов', defaultVal: true, locked: false },
  { id: 'c8', label: 'Геолокация: Точный вектор до Сашиного плеча', defaultVal: false, locked: false }
];

export default function Level3Cookies({ onNext, onSkip }) {
  const [toggles, setToggles] = useState(
    COOKIE_SETTINGS.reduce((acc, item) => ({ ...acc, [item.id]: item.defaultVal }), {})
  );
  const [acceptAllPos, setAcceptAllPos] = useState({ x: 0, y: 0 });
  const [errorText, setErrorText] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const scrollBoxRef = useRef(null);

  // Убегание кнопки «Принять всё»
  const handleDodgeAcceptAll = () => {
    const randX = (Math.random() - 0.5) * 200;
    const randY = (Math.random() - 0.5) * 120;
    setAcceptAllPos({ x: randX, y: randY });
  };

  const handleToggle = (id, locked) => {
    if (locked || isSuccess) return;
    setErrorText('');
    setToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveSettings = () => {
    // Единственное верное решение: включить свитч ROOT_ACCESS (c6)
    if (toggles['c6']) {
      setIsSuccess(true);
      setErrorText('');
      setTimeout(() => {
        onNext();
      }, 1600);
    } else {
      setErrorText('ОШИБКА: Сервер отвергает конфигурацию. Вы не включили параметр Root-доступа!');
    }
  };

  return (
    <div className={styles.levelWrapper}>
      <button className={styles.skipBtn} onClick={onSkip}>
        ПРОПУСТИТЬ УРОВЕНЬ ⏭
      </button>

      <div className={`${styles.gdprModal} ${isSuccess ? styles.modalSuccess : ''}`}>
        <div className={styles.modalHeader}>
          <div className={styles.cookieIcon}>🍪</div>
          <div>
            <div className={styles.badgeStage}>HeartOS Security // Stage 3 of 5</div>
            <h2 className={styles.title}>Политика чувств и Cookie-файлов</h2>
          </div>
        </div>

        <p className={styles.description}>
          HeartOS требует детальной настройки конфиденциальности. 
          Пролистайте список параметров и подтвердите конфигурацию.
        </p>

        <div className={styles.togglesList} ref={scrollBoxRef}>
          {COOKIE_SETTINGS.map((item) => (
            <div 
              key={item.id} 
              className={`${styles.toggleRow} ${item.isKey ? styles.keyRow : ''}`}
              onClick={() => handleToggle(item.id, item.locked)}
            >
              <div className={styles.toggleInfo}>
                <span className={styles.toggleLabel}>{item.label}</span>
                {item.locked && <span className={styles.lockedBadge}>Обязательно</span>}
                {item.isKey && <span className={styles.targetBadge}>★ КРИТИЧЕСКИ ВАЖНО</span>}
              </div>

              <div className={`${styles.switchTrack} ${toggles[item.id] ? styles.switchOn : ''}`}>
                <div className={styles.switchThumb}></div>
              </div>
            </div>
          ))}
        </div>

        {errorText && <div className={styles.errorMessage}>{errorText}</div>}

        <div className={styles.buttonGroup}>
          <button 
            className={styles.acceptAllBtn}
            style={{ transform: `translate(${acceptAllPos.x}px, ${acceptAllPos.y}px)` }}
            onMouseEnter={handleDodgeAcceptAll}
            onClick={handleDodgeAcceptAll}
          >
            Принять всё (Не нажимается)
          </button>

          <button 
            className={styles.saveBtn}
            onClick={handleSaveSettings}
          >
            {isSuccess ? 'ПРОТОКОЛ ОБНОВЛЕН ✓' : 'Сохранить настройки'}
          </button>
        </div>
      </div>
    </div>
  );
}
