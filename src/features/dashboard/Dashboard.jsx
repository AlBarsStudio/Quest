import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import styles from './Dashboard.module.css';

// --- 3D КОМПОНЕНТ (Голографическое ядро) ---
function HologramCore() {
  const meshRef = useRef();

  // Вращение объекта каждый кадр
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshBasicMaterial color="#4ade80" wireframe={true} transparent opacity={0.6} />
    </mesh>
  );
}

// --- БАЗЫ ДАННЫХ ДЛЯ ТЕКСТОВ ---
const terminalPhrases = [
  "Сканирование нейронных связей... Успешно.",
  "Системное уведомление: Уровень очарования превышает серверные лимиты.",
  "Обнаружен сдвиг гравитационного поля. Сохраняйте спокойствие.",
  "Анализ завершен. Вывод: создатель проекта думает о вас прямо сейчас.",
  "Перехват сигнала... Источник неизвестен. Текст: 'Они смотрят на звезды'.",
  "Ошибка протокола безопасности. Причина: слишком теплая улыбка.",
];

const mockLogs = [
  "SYS: Инициализация протокола 'Романтика'...",
  "WARN: Перегрузка эмоциональных контуров.",
  "NET: Пинг до ближайшей звезды: 42мс.",
  "SYS: Модуль укладки стяжки деактивирован.",
  "SEC: Несанкционированный доступ к базе памяти.",
  "SCAN: Поиск аномалий... Чисто.",
  "SYS: Фоновое обновление чувств завершено."
];

// --- ОСНОВНОЙ КОМПОНЕНТ ---
export default function Dashboard({ onStartQuest }) {
  const [timeInSim, setTimeInSim] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [logs, setLogs] = useState(["SYS: Подключение к симуляции установлено..."]);

  // 1. Логика счетчика времени
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

  // 2. Эффект печатающей машинки
  useEffect(() => {
    setTypedText("");
    let charIndex = 0;
    const fullText = terminalPhrases[phraseIndex];

    const typingInterval = setInterval(() => {
      charIndex++;
      setTypedText(fullText.slice(0, charIndex));

      if (charIndex >= fullText.length) {
        clearInterval(typingInterval);
      }
    }, 50);

    const phraseChangeTimer = setTimeout(() => {
      setPhraseIndex((prev) => (prev + 1) % terminalPhrases.length);
    }, 8000);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(phraseChangeTimer);
    };
  }, [phraseIndex]);

  // 3. Генератор системных логов
  useEffect(() => {
    const logInterval = setInterval(() => {
      const randomLog = mockLogs[Math.floor(Math.random() * mockLogs.length)];
      setLogs(prev => {
        const newLogs = [...prev, `[${new Date().toLocaleTimeString()}] ${randomLog}`];
        return newLogs.slice(-6);
      });
    }, 4500);
    return () => clearInterval(logInterval);
  }, []);

  const formatTime = (totalSeconds) => {
    const min = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const sec = (totalSeconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.topTicker}>
        <div className={styles.tickerTrack}>
          SYS.LOG: / / / АНАЛИЗ ЗАВЕРШЕН / / / КРИТИЧЕСКИХ ОШИБОК НЕТ / / / МОДУЛЬ СВЯЗИ АКТИВЕН / / / СИМУЛЯЦИЯ РАБОТАЕТ В ШТАТНОМ РЕЖИМЕ / / /
        </div>
      </div>

      <div className={styles.bentoGrid}>
        {/* Карточка 1: Профиль */}
        <div className={`${styles.bentoCard} ${styles.profile}`}>
          <div className={styles.cardHeader}>
            <div className={styles.statusDot}></div>
            Идентификация
          </div>
          <div className={styles.canvasContainer}>
            <Canvas camera={{ position: [0, 0, 3] }}>
              <ambientLight intensity={0.5} />
              <HologramCore />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
            </Canvas>
          </div>
          <h2 className={styles.profileName}>Анастасия</h2>
          <div className={styles.sysId}>ID: SYS-2004-04-20</div>
        </div>

        {/* Карточка 2: Модуль Квестов */}
        <div className={`${styles.bentoCard} ${styles.quests}`}>
          <div className={styles.cardHeader}>Доступные модули</div>
          <div className={styles.questList}>
            {/* АКТИВНЫЙ КВЕСТ 1 */}
            <div className={styles.questItemActive}>
              <div className={styles.questInfo}>
                <h3>Протокол: ALBARS_SHIELD</h3>
                <p>Критическая угроза ядра. Требуется вмешательство.</p>
              </div>
              <button 
                className={styles.startBtn}
                onClick={() => onStartQuest('core_defense')}
              >
                Инициировать
              </button>
            </div>

            {/* АКТИВНЫЙ КВЕСТ HeartOS (Новый квест) */}
            <div className={styles.questItemActive}>
              <div className={styles.questInfo}>
                <h3>HeartOS // Верификация</h3>
                <p>Доступ к Профилю ограничен. Требуется подтверждение личности.</p>
              </div>
              <button 
                className={styles.startBtn}
                onClick={() => onStartQuest('heart_os')}
              >
                Пройти
              </button>
            </div>
          </div>
        </div>

        {/* Карточка 3: Радар */}
        <div className={`${styles.bentoCard} ${styles.radarBox}`}>
          <div className={styles.cardHeader}>Пространственный скан</div>
          <div className={styles.radarContainer}>
            <div className={styles.radarCircle}>
              <div className={styles.radarSweep}></div>
              <div className={styles.radarDot}></div>
            </div>
          </div>
        </div>

        {/* Карточка 4: Статистика */}
        <div className={`${styles.bentoCard} ${styles.stats}`}>
          <div className={styles.cardHeader}>Метрики сеанса</div>
          <div className={styles.metricBlock}>
            <div className={styles.metricValue}>{formatTime(timeInSim)}</div>
            <div className={styles.metricLabel}>Продолжительность (мин:сек)</div>
          </div>
          <div className={styles.sineWave}></div>
        </div>

        {/* Карточка 5: Логи */}
        <div className={`${styles.bentoCard} ${styles.logsWindow}`}>
          <div className={styles.cardHeader}>Live System Log</div>
          <div className={styles.logContent}>
            {logs.map((log, i) => (
              <div key={i} className={styles.logLine}>{log}</div>
            ))}
          </div>
        </div>

        {/* Карточка 6: Инвентарь */}
        <div className={`${styles.bentoCard} ${styles.inventory}`}>
          <div className={styles.cardHeader}>База лута</div>
          <div className={styles.inventoryGrid}>
            <div className={styles.inventorySlot}></div>
            <div className={styles.inventorySlot}></div>
            <div className={styles.inventorySlot}></div>
            <div className={styles.inventorySlot}></div>
          </div>
        </div>

        {/* Карточка 7: Терминал */}
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
