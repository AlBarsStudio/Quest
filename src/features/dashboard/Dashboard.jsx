import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import styles from './Dashboard.module.css';

// --- 3D КОМПОНЕНТ (Голографическое ядро) ---
function HologramCore() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
    // Легкая пульсация масштаба
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshBasicMaterial color="#4ade80" wireframe={true} transparent opacity={0.6} />
    </mesh>
  );
}

// --- БАЗЫ ДАННЫХ ДЛЯ ТЕКСТОВ И ЛОГОВ ---
const terminalPhrases = [
  "Сканирование нейронных связей... Успешно.",
  "Системное уведомление: Уровень очарования превышает серверные лимиты.",
  "Обнаружен сдвиг гравитационного поля. Сохраняйте спокойствие.",
  "Анализ завершен. Вывод: создатель проекта думает о вас прямо сейчас.",
  "Перехват сигнала... Текст: 'Они смотрят на звезды'.",
  "Внимание: Аномальный всплеск дофамина в секторе 4.",
];

const mockLogs = [
  "SYS: Инициализация протокола 'Романтика'...",
  "WARN: Перегрузка эмоциональных контуров.",
  "NET: Пинг до мобильного устройства... 2мс. Канал стабилен.",
  "SYS: Рендер React-компонентов завершен.",
  "SEC: Проверка защиты ALBARS_SHIELD... Угроз не обнаружено.",
  "SCAN: Сборка бандла Vite прошла без ошибок.",
  "SYS: Фоновое обновление чувств завершено."
];

// --- ОСНОВНОЙ КОМПОНЕНТ ---
export default function Dashboard({ onStartQuest }) {
  const [timeInSim, setTimeInSim] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [logs, setLogs] = useState(["SYS: Подключение к симуляции установлено..."]);
  
  // Динамические данные для графиков
  const [cpuLoad, setCpuLoad] = useState(12);
  const [syncLevel, setSyncLevel] = useState(98);

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
    setTypedText("");
    let charIndex = 0;
    const fullText = terminalPhrases[phraseIndex];

    const typingInterval = setInterval(() => {
      charIndex++;
      setTypedText(fullText.slice(0, charIndex));
      if (charIndex >= fullText.length) clearInterval(typingInterval);
    }, 50);

    const phraseChangeTimer = setTimeout(() => {
      setPhraseIndex((prev) => (prev + 1) % terminalPhrases.length);
    }, 6000);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(phraseChangeTimer);
    };
  }, [phraseIndex]);

  // 3. Генератор логов и динамических графиков
  useEffect(() => {
    const logInterval = setInterval(() => {
      const randomLog = mockLogs[Math.floor(Math.random() * mockLogs.length)];
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${randomLog}`].slice(-8));
      
      // Случайные колебания метрик
      setCpuLoad(Math.floor(Math.random() * 30) + 10);
      setSyncLevel(Math.floor(Math.random() * 5) + 95);
    }, 3500);
    return () => clearInterval(logInterval);
  }, []);

  const formatTime = (totalSeconds) => {
    const min = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const sec = (totalSeconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Бегущая строка наверху */}
      <div className={styles.topTicker}>
        <div className={styles.tickerTrack}>
          SYS.LOG: / / / АНАЛИЗ ЗАВЕРШЕН / / / КРИТИЧЕСКИХ ОШИБОК НЕТ / / / МОДУЛЬ СВЯЗИ АКТИВЕН / / / СИМУЛЯЦИЯ РАБОТАЕТ В ШТАТНОМ РЕЖИМЕ / / /
        </div>
      </div>

      <div className={styles.bentoGrid}>
        
        {/* Карточка 1: Профиль (Hologram) */}
        <div className={`${styles.bentoCard} ${styles.profile}`}>
          <div className={styles.cardHeader}>
            <div className={styles.statusDot}></div>
            Идентификация Ядра
          </div>
          <div className={styles.canvasContainer}>
            <Canvas camera={{ position: [0, 0, 3] }}>
              <ambientLight intensity={0.5} />
              <HologramCore />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
            </Canvas>
          </div>
          <h2 className={styles.profileName}>Анастасия</h2>
          <div className={styles.sysId}>ID: SYS-2004-04-20</div>
          <div className={styles.authBadge}>Root Доступ Разрешен</div>
        </div>

        {/* Карточка 2: Модуль Квестов */}
        <div className={`${styles.bentoCard} ${styles.quests}`}>
          <div className={styles.cardHeader}>Доступные модули</div>
          <div className={styles.questList}>
            
            <div className={styles.questItem}>
              <div className={styles.questInfo}>
                <h3>Протокол: ALBARS_SHIELD</h3>
                <p>Угроза ядру. Требуется защита.</p>
              </div>
              <button className={styles.startBtn} onClick={() => onStartQuest('core_defense')}>
                Запуск
              </button>
            </div>

            <div className={styles.questItemActive}>
              <div className={styles.questInfo}>
                <h3>Sys.Anomaly // Синхронизация</h3>
                <p>Найдены нелогичные файлы. Нужна верификация.</p>
              </div>
              <button className={styles.startBtnPulse} onClick={() => onStartQuest('neural_sync')}>
                Подключиться
              </button>
            </div>

          </div>
        </div>

        {/* Карточка 3: Мониторинг ресурсов (Новая) */}
        <div className={`${styles.bentoCard} ${styles.systemMetrics}`}>
          <div className={styles.cardHeader}>Системные ресурсы</div>
          <div className={styles.metricsWrapper}>
            <div className={styles.metricRow}>
              <span>CPU (Эмоции)</span>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{width: `${cpuLoad}%`}}></div></div>
              <span>{cpuLoad}%</span>
            </div>
            <div className={styles.metricRow}>
              <span>RAM (Память)</span>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{width: '88%'}}></div></div>
              <span>88%</span>
            </div>
            <div className={styles.metricRow}>
              <span>Синхронизация</span>
              <div className={styles.progressBar}><div className={styles.progressFillPulse} style={{width: `${syncLevel}%`}}></div></div>
              <span className={styles.highlightText}>{syncLevel}%</span>
            </div>
          </div>
        </div>

        {/* Карточка 4: Радар */}
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

        {/* Карточка 5: Био-ритмы (Новая - График) */}
        <div className={`${styles.bentoCard} ${styles.bioChart}`}>
          <div className={styles.cardHeader}>Уровень Дофамина</div>
          <div className={styles.chartContainer}>
            <div className={styles.bar} style={{height: '40%'}}></div>
            <div className={styles.bar} style={{height: '60%'}}></div>
            <div className={styles.bar} style={{height: '45%'}}></div>
            <div className={styles.bar} style={{height: '80%'}}></div>
            <div className={styles.bar} style={{height: '65%'}}></div>
            <div className={styles.bar} style={{height: '95%'}}></div>
            <div className={styles.bar} style={{height: '100%', backgroundColor: '#4ade80'}}></div>
          </div>
        </div>

        {/* Карточка 6: Логи */}
        <div className={`${styles.bentoCard} ${styles.logsWindow}`}>
          <div className={styles.cardHeader}>Live System Log</div>
          <div className={styles.logContent}>
            {logs.map((log, i) => (
              <div key={i} className={styles.logLine}>{log}</div>
            ))}
          </div>
        </div>

        {/* Карточка 7: Терминал (широкая) */}
        <div className={`${styles.bentoCard} ${styles.terminal}`}>
          <div className={styles.cardHeader}>Входящий канал связи [Шифрование: RSA-4096]</div>
          <div className={styles.terminalWindow}>
            <div className={styles.terminalTime}>[{formatTime(timeInSim)}] Uptime</div>
            <span className={styles.terminalPrefix}>root@albars-server:~# </span>
            <span className={styles.terminalText}>{typedText}</span>
            <span className={styles.cursor}>_</span>
          </div>
        </div>

      </div>
    </div>
  );
                                  }
    
