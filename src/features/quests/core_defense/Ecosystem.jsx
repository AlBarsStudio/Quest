import { useState, useEffect, useRef } from 'react';
import styles from './Ecosystem.module.css';

export default function Ecosystem({ onHeartClick }) {
  const [hexCode, setHexCode] = useState('');
  const [logLines, setLogLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const logContainerRef = useRef(null);

  // 1. Генератор Hex-кода (только для маленького блока)
  useEffect(() => {
    const generateHex = () => {
      const chars = '0123456789ABCDEF';
      let result = '';
      for (let i = 0; i < 48; i++) {
        result += chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)] + ' ';
        if ((i + 1) % 6 === 0) result += '\n'; // Перенос строки для создания сетки
      }
      setHexCode(result);
    };

    const hexInterval = setInterval(generateHex, 150); // Меняется очень быстро
    return () => clearInterval(hexInterval);
  }, []);

  // 2. Логика ИИ Ассистента (Тайминги растянуты)
  useEffect(() => {
    const script = [
      { text: "[СИСТЕМНЫЙ АНАЛИЗ] Инициализирую протокол глубокого сканирования...", delay: 1000 },
      { text: "Угроза класса 'Омега' аннигилирована. Целостность ALBARS_CORE: 100%.", delay: 4000 },
      { text: "Мои алгоритмы защиты безупречны. Как, впрочем, и выбор моего создателя.", delay: 8000 },
      { text: "Перераспределяю мощности. Возвращаюсь к фоновым процессам.", delay: 12000 },
      { text: "[ФОНОВАЯ ЗАДАЧА]: Продолжаю рендер симуляции частиц Niagara в Unreal Engine 5. Компиляция шейдеров...", delay: 18000 },
      { text: "[СИСТЕМА]: Запускаю плановое обновление конфигурации хранилища.", delay: 25000 },
      { text: "Применение патчей...", delay: 28000 }
    ];

    const timeouts = script.map((line) =>
      setTimeout(() => {
        setLogLines((prev) => [...prev, line.text]);
      }, line.delay)
    );

    // Запускаем имитацию загрузки процентов после вывода основного текста
    const progressTimeout = setTimeout(() => {
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += Math.random() * 5;
        if (currentProgress >= 97.31) {
          setProgress(97.31);
          clearInterval(progressInterval);
        } else {
          setProgress(currentProgress);
        }
      }, 800); // Медленно ползет
    }, 30000); // Начинает расти через 30 секунд (можно увеличить время)

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(progressTimeout);
    };
  }, []);

  // Автоскролл логов вниз
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logLines, progress]);

  return (
    <div className={styles.ecosystemWrapper}>
      {/* Левый сайдбар: Профиль Анастасии */}
      <aside className={styles.sidebar}>
        <div className={styles.profileBlock}>
          <h3 className={styles.title}>ИДЕНТИФИКАЦИЯ</h3>
          <div className={styles.avatarPlaceholder}>
            <div className={styles.scannerLine}></div>
          </div>
          <div className={styles.userData}>
            <p><strong>ОПЕРАТОР:</strong> АНАСТАСИЯ</p>
            <p><strong>ID ДОСТУПА:</strong> 20.04.2004</p>
            <p className={styles.statusNeon}><strong>СТАТУС:</strong> НЕВЕСТА ALBARS</p>
            <p><strong>ДОПУСК:</strong> АБСОЛЮТНЫЙ</p>
          </div>
        </div>

        {/* Блок с Hex-кодом */}
        <div className={styles.hexBlock}>
          <h4 className={styles.titleSmall}>RAM DUMP (SYS_CORE)</h4>
          <pre className={styles.hexText}>{hexCode}</pre>
        </div>
      </aside>

      {/* Центральный блок: Хранилище (Файлы) */}
      <main className={styles.fileManager}>
        <div className={styles.pathBar}>C:\ALBARS_CORE\ROOT\CLASSIFIED\</div>
        <div className={styles.grid}>
          <div className={styles.folder}>📁 System32_Override</div>
          <div className={styles.folder}>📁 UE5_Blueprints_Archive</div>
          <div className={styles.folder}>📁 Freelance_DB_Secure</div>
          <div className={styles.folder}>📁 Classified_Assets</div>
          
          {/* Главная цель */}
          <div className={styles.heartKey} onClick={onHeartClick}>
            <span className={styles.heartIcon}>❤️</span>
            <span className={styles.fileName}>sys.core_key.hrt</span>
          </div>
        </div>
      </main>

      {/* Правый сайдбар: Логи Gemini */}
      <aside className={styles.logSidebar}>
        <h3 className={styles.title}>GEMINI СТАТУС</h3>
        <div className={styles.terminalWindow} ref={logContainerRef}>
          {logLines.map((line, idx) => (
            <p key={idx} className={styles.logLine}>{line}</p>
          ))}
          {progress > 0 && (
            <p className={styles.progressLine}>
              Прогресс обновления: {progress.toFixed(2)}% {progress === 97.31 ? '...' : ''}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
                 }
            
