import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';

// Массив наших научно-романтичных фраз
const terminalPhrases = [
  "Сканирование нейронных связей... Успешно.",
  "Системное уведомление: Уровень очарования превышает серверные лимиты.",
  "Обнаружен сдвиг гравитационного поля. Сохраняйте спокойствие.",
  "Анализ завершен. Вывод: создатель проекта думает о вас прямо сейчас.",
  "Перехват сигнала... Источник неизвестен. Текст: 'Они смотрят на звезды'.",
  "Ошибка протокола безопасности. Причина: слишком теплая улыбка.",
];

export default function Dashboard() {
  const [timeInSim, setTimeInSim] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState("");

  // Логика счетчика времени
  useEffect(() => {
    let startTime = localStorage.getItem('simStartTime');
    if (!startTime) {
      startTime = Date.now();
      localStorage.setItem('simStartTime', startTime);
    }
    const interval = setInterval(() => {
      setTimeInSim(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Эффект печатающей машинки для терминала
  useEffect(() => {
    const fullText = terminalPhrases[phraseIndex];
    setTypedText(""); // Очищаем перед новой фразой
    let charIndex = 0;

    const typingInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        setTypedText((prev) => prev + fullText.charAt(charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50); // Скорость печати (50мс на букву)

    // Меняем фразу каждые 8 секунд
    const phraseChangeTimer = setTimeout(() => {
      setPhraseIndex((prev) => (prev + 1) % terminalPhrases.length);
    }, 8000);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(phraseChangeTimer);
    };
  }, [phraseIndex]);

  const formatTime = (totalSeconds) => {
    const min = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const sec = (totalSeconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
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
          <div className={styles.statusText}>
            Статус: Синхронизация с реальностью 99.8%
          </div>
        </div>

        {/* Карточка 2: Модуль Квестов */}
        <div className={`${styles.bentoCard} ${styles.quests}`}>
          <div className={styles.cardHeader}>Доступные модули</div>
          <div className={styles.questList}>
            {/* Активный квест */}
            <div className={styles.questItemActive}>
              <div className={styles.questInfo}>
                <h3>Протокол: Разминирование</h3>
                <p>Требуется ручное вмешательство в ядро системы.</p>
              </div>
              <button className={styles.startBtn}>Инициировать</button>
            </div>
            
            {/* Заблокированные квесты (стяжка и мебель в sci-fi обертке) */}
            <div className={styles.questItemLocked}>
              <div className={styles.questInfo}>
                <h3>Протокол: Монолитное основание</h3>
                <p>Модуль заблокирован. Требуется допуск 2 уровня.</p>
              </div>
              <div className={styles.lockIcon}>🔒</div>
            </div>

            <div className={styles.questItemLocked}>
              <div className={styles.questInfo}>
                <h3>Протокол: Сборка конструкта</h3>
                <p>Модуль заблокирован. Требуется допуск 3 уровня.</p>
              </div>
              <div className={styles.lockIcon}>🔒</div>
            </div>
          </div>
        </div>

        {/* Карточка 3: Статистика */}
        <div className={`${styles.bentoCard} ${styles.stats}`}>
          <div className={styles.cardHeader}>Метрики сеанса</div>
          <div className={styles.metricBlock}>
            <div className={styles.metricValue}>{formatTime(timeInSim)}</div>
            <div className={styles.metricLabel}>Продолжительность симуляции</div>
          </div>
          <div className={styles.metricBlock}>
            <div className={styles.metricValue}>12 048</div>
            <div className={styles.metricLabel}>Проанализировано вероятностей</div>
          </div>
        </div>

        {/* Карточка 4: Инвентарь */}
        <div className={`${styles.bentoCard} ${styles.inventory}`}>
          <div className={styles.cardHeader}>База артефактов</div>
          <div className={styles.inventoryGrid}>
            <div className={styles.inventorySlot}></div>
            <div className={styles.inventorySlot}></div>
            <div className={styles.inventorySlot}></div>
            <div className={styles.inventorySlot}></div>
          </div>
        </div>

        {/* Карточка 5: Терминал фраз */}
        <div className={`${styles.bentoCard} ${styles.terminal}`}>
          <div className={styles.cardHeader}>Входящий канал связи</div>
          <div className={styles.terminalWindow}>
            <span className={styles.terminalPrefix}>{">"} </span>
            {typedText}
            <span className={styles.cursor}>_</span>
          </div>
        </div>

      </div>
    </div>
  );
}
