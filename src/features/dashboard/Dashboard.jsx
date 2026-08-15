import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import styles from './Dashboard.module.css';

/*
 * ==========================================
 * AI CONTEXT NOTES (DO NOT DELETE)
 * ==========================================
 * Project: Interactive Web Quest for Anastasia.
 * Author: Aleksandr (Al Bars / AlBarsStudio).
 * Context: Sci-fi terminal interface leading to a final real-world surprise.
 * ==========================================
 */

// --- 3D КОМПОНЕНТ (Живое Голографическое ядро) ---
function HologramCore() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshBasicMaterial color="#4ade80" wireframe={true} transparent opacity={0.7} />
    </mesh>
  );
}

// --- БАЗА ДАННЫХ КВЕСТОВ (Все активны для тестирования) ---
const questsData = [
  {
    id: 'core_defense',
    title: 'Протокол: ALBARS_SHIELD (Тайпинг)',
    desc: 'Отражение кибератаки. Ввод скоростного кода.',
    status: 'active' 
  },
  {
    id: 'heart_os',
    title: 'Протокол: Heart OS (Капча)',
    desc: 'Верификация чувств. Обход защиты слоев.',
    status: 'active'
  },
  {
    id: 'neural_sync',
    title: 'Sys.Anomaly // Синхронизация (Бот)',
    desc: 'Нейронный контакт с системным ядром.',
    status: 'active'
  },
  {
    id: 'final_quest',
    title: 'Протокол: GRAND_FINALE',
    desc: 'Слияние артефактов. Требуются ключи дешифровки.',
    status: 'active'
  }
];

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
  "SEC: Защита ALBARS_SHIELD активна.",
  "SCAN: Поиск аномалий... Чисто.",
  "SYS: Фоновое обновление чувств завершено."
];

// --- ОСНОВНОЙ КОМПОНЕНТ ---
export default function Dashboard({ onStartQuest }) {
  const [timeInSim, setTimeInSim] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [logs, setLogs] = useState(["SYS: Подключение к симуляции установлено..."]);

  // 1. Таймер симуляции
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
    let charIndex = 0;
    const fullText = terminalPhrases[phraseIndex];
    let typingInterval;

    setTypedText(""); 

    const startTimeout = setTimeout(() => {
      typingInterval = setInterval(() => {
        charIndex++;
        setTypedText(fullText.slice(0, charIndex));
        if (charIndex >= fullText.length) clearInterval(typingInterval);
      }, 50);
    }, 400); 

    const phraseChangeTimer = setTimeout(() => {
      setPhraseIndex((prev) => (prev + 1) % terminalPhrases.length);
    }, 8000);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(typingInterval);
      clearTimeout(phraseChangeTimer);
    };
  }, [phraseIndex]);

  // 3. Генератор логов
  useEffect(() => {
    const logInterval = setInterval(() => {
      const randomLog = mockLogs[Math.floor(Math.random() * mockLogs.length)];
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${randomLog}`].slice(-6));
    }, 4000);
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
            Идентификация Ядра
          </div>
          <div className={styles.canvasContainer}>
            <Canvas camera={{ position: [0, 0, 3.5] }}>
              <ambientLight intensity={0.6} />
              <HologramCore />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} />
            </Canvas>
          </div>
          <h2 className={styles.profileName}>Анастасия</h2>
          <div className={styles.sysId}>ID: SYS-2004-04-20</div>
          <div className={styles.authBadge}>Root Доступ Разрешен</div>
        </div>

        {/* Карточка 2: Модуль Квестов (Все активны) */}
        <div className={`${styles.bentoCard} ${styles.quests}`}>
          <div className={styles.cardHeader}>Доступные модули</div>
          <div className={styles.questList}>
            {questsData.map((quest) => (
              <div 
                key={quest.id} 
                className={`${styles.questItem} ${styles[quest.status]}`}
              >
                <div className={styles.questInfo}>
                  <h3>{quest.title}</h3>
                  <p>{quest.desc}</p>
                </div>
                {quest.status === 'completed' && <div className={styles.statusIcon}>✓</div>}
                {quest.status === 'locked' && <div className={styles.statusIcon}>🔒</div>}
                {quest.status === 'active' && (
                  <button 
                    className={styles.startBtnPulse}
                    onClick={() => onStartQuest(quest.id)}
                  >
                    Подключиться
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Карточка 3: Радар */}
        <div className={`${styles.bentoCard} ${styles.radarBox}`}>
          <div className={styles.cardHeader}>Пространственный скан</div>
          <div className={styles.radarContainer}>
            <div className={styles.radarCircle}>
              <div className={styles.radarSweep}></div>
              <div className={styles.radarDot}></div>
              <div className={styles.radarDot2}></div>
            </div>
          </div>
        </div>

        {/* Карточка 4: Метрики и Эквалайзер */}
        <div className={`${styles.bentoCard} ${styles.stats}`}>
          <div className={styles.cardHeader}>Метрики сеанса</div>
          <div className={styles.statsWrapper}>
            <div className={styles.timeBlock}>
              <div className={styles.metricValue}>{formatTime(timeInSim)}</div>
              <div className={styles.metricLabel}>Продолжительность (мин:сек)</div>
            </div>
            <div className={styles.equalizer}>
              <div className={styles.eqBar}></div>
              <div className={styles.eqBar}></div>
              <div className={styles.eqBar}></div>
              <div className={styles.eqBar}></div>
              <div className={styles.eqBar}></div>
            </div>
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
          <div className={styles.cardHeader}>База артефактов</div>
          <div className={styles.inventoryGrid}>
            <div className={`${styles.inventorySlot} ${styles.slotFilled}`}></div>
            <div className={styles.inventorySlot}></div>
            <div className={styles.inventorySlot}></div>
            <div className={styles.inventorySlot}></div>
          </div>
        </div>

        {/* Карточка 7: Терминал */}
        <div className={`${styles.bentoCard} ${styles.terminal}`}>
          <div className={styles.cardHeader}>Входящий канал связи [Шифрование: RSA-4096]</div>
          <div className={styles.terminalWindow}>
            <span className={styles.terminalPrefix}>root@albars:~# </span>
            <span className={styles.terminalText}>{typedText}</span>
            <span className={styles.cursor}>_</span>
          </div>
        </div>

      </div>
    </div>
  );
}
