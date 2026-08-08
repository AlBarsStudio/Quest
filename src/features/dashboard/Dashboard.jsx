import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [timeInSim, setTimeInSim] = useState(0);

  // Логика счетчика времени через localStorage
  useEffect(() => {
    // Проверяем, есть ли уже сохраненное время старта
    let startTime = localStorage.getItem('simStartTime');
    
    if (!startTime) {
      startTime = Date.now();
      localStorage.setItem('simStartTime', startTime);
    }

    // Обновляем время каждую секунду
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
      setTimeInSim(elapsedSeconds);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Форматируем секунды в MM:SS
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.bentoGrid}>
        
        {/* Карточка 1: Профиль */}
        <div className={`${styles.bentoCard} ${styles.profile}`}>
          <div className={styles.cardHeader}>
            <div className={styles.statusDot}></div>
            Идентификация
          </div>
          <h2 className={styles.profileName}>Анастасия</h2>
          <div className={styles.sysId}>ID: SYS-2004-04-20</div>
          <div style={{ marginTop: 'auto', fontSize: '0.85rem', color: '#888' }}>
            Статус: Синхронизация с реальностью 99.8%
          </div>
        </div>

        {/* Карточка 2: Модуль Квестов (Пока заглушка) */}
        <div className={`${styles.bentoCard} ${styles.quests}`}>
          <div className={styles.cardHeader}>Доступные модули (Квесты)</div>
          <div style={{ color: '#aaa' }}>
            Здесь будет список квестов с красивыми hover-эффектами...
          </div>
        </div>

        {/* Карточка 3: Статистика */}
        <div className={`${styles.bentoCard} ${styles.stats}`}>
          <div className={styles.cardHeader}>Метрики сеанса</div>
          <div>
            <div className={styles.metricValue}>{formatTime(timeInSim)}</div>
            <div className={styles.metricLabel}>Время в симуляции (мин:сек)</div>
          </div>
        </div>

        {/* Карточка 4: Инвентарь и Ачивки */}
        <div className={`${styles.bentoCard} ${styles.inventory}`}>
          <div className={styles.cardHeader}>База артефактов</div>
          <div style={{ color: '#aaa' }}>Слоты для лута пусты...</div>
        </div>

        {/* Карточка 5: Терминал фраз (Пока заглушка) */}
        <div className={`${styles.bentoCard} ${styles.terminal}`}>
          <div className={styles.cardHeader}>Входящие сообщения</div>
          <div style={{ fontFamily: 'Courier New', color: '#4ade80' }}>
            {">"} Ожидание входящих пакетов данных...
          </div>
        </div>

      </div>
    </div>
  );
}
