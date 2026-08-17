import { useState, useEffect, useRef } from 'react';
import HackingPhase from './HackingPhase';
import Ecosystem from './Ecosystem';
import styles from './CoreDefense.module.css';

const FULL_STORY_TEXT = `> [SYS.BOOT] ИНИЦИАЛИЗАЦИЯ ЯДРА v5.2.0-ALBARS... [OK]
> [SEC.AUTH] ВЫДЕЛЕНИЕ ЗАЩИЩЕННОГО БУФЕРА ПАМЯТИ... [OK]
> [NET.BRIDGE] TLS 1.3 КАНАЛ СВЯЗИ УСТАНОВЛЕН [PING: 14ms]
> [AI.CORE] ПОДКЛЮЧЕНИЕ КОГНИТИВНОГО МОДУЛЯ...
> [AI.STATUS] АССИСТЕНТ GEMINI AI УСПЕШНО СИНХРОНИЗИРОВАН С СИСТЕМОЙ.
> [IDENTITY] АВТОРИЗАЦИЯ ОПЕРАТОРА: АНАСТАСИЯ // ДОСТУП: ROOT_OWNER

======================================================================
[ВХОДЯЩИЙ КАНАЛ СВЯЗИ // GEMINI AI ASSISTANT]:

Приветствую, Анастасия. Я — бортовой интеллект системы ALBARS_CORE. Передаю сводку критической ситуации.

Уже более 5 лет Саша непрерывно создаёт свою цифровую вселенную в IT: разработка игр и сложная логика на Unreal Engine, 3D-моделирование в Blender, Maya и 3ds Max, режиссура и монтаж в Premiere Pro, веб-архитектура, терабайты уникальных ассетов, авторских пресетов, аудио и видеоматериалов. Всё это находится на сервере ALBARS_CORE и представляет для него колоссальную ценность — как материальную, так и личную. Это результат тысяч часов труда.

Ровно неделю назад наш сервер подвергся спланированной кибератаке элитной хакерской группировки. Их цель — стереть данные и навсегда заблокировать ядро.

Но злоумышленники просчитались: буквально за 48 часов до первой волны атаки Саша полностью перестроил архитектуру безопасности и передал абсолютный root-доступ к главному ядру единственному человеку, которому доверяет больше всего — тебе.

Внешний периметр пробит. Хакеры уже внутри файловой системы, но у них нет мастер-ключа. Твоя задача — пробиться сквозь блокировки к Ядру Безопасности быстрее, чем они перехватят контроль над сервером.
======================================================================

> [CRITICAL_ALARM] ШЛЮЗ АКТИВЕН. ВРЕМЯ НА ОПЕРАЦИЮ ОГРАНИЧЕНО!
> Нажмите [ENTER] или кнопку ниже для экстренной контратаки.`;

export default function CoreDefense({ onReturnToDashboard }) {
  const [phase, setPhase] = useState('intro');
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [hackResults, setHackResults] = useState(null);
  
  const terminalBodyRef = useRef(null);

  // Живая печать с динамическими человеческими задержками
  useEffect(() => {
    if (phase !== 'intro') return;

    let currentIndex = 0;
    let isCancelled = false;
    let timeoutId = null;

    const getDelay = (char) => {
      if (char === '\n') return Math.floor(Math.random() * 200) + 300; // Пауза на новой строке
      if (['.', '!', '?'].includes(char)) return Math.floor(Math.random() * 250) + 350; // Пауза в конце предложения
      if ([',', ':', ';', '-'].includes(char)) return Math.floor(Math.random() * 80) + 130; // Пауза на знаках
      
      // 4% шанс на легкую человеческую запинку
      if (Math.random() < 0.04) return Math.floor(Math.random() * 120) + 110;

      // Базовая скорость набора символа (18 - 36 мс)
      return Math.floor(Math.random() * 18) + 18;
    };

    const typeNextChar = () => {
      if (isCancelled) return;

      if (currentIndex < FULL_STORY_TEXT.length) {
        const char = FULL_STORY_TEXT[currentIndex];
        currentIndex++;
        setDisplayedText(FULL_STORY_TEXT.slice(0, currentIndex));

        // Автоскролл консоли вниз за кареткой
        if (terminalBodyRef.current) {
          terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
        }

        timeoutId = setTimeout(typeNextChar, getDelay(char));
      } else {
        setIsTypingComplete(true);
      }
    };

    timeoutId = setTimeout(typeNextChar, 500);

    return () => {
      isCancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [phase]);

  // Быстрый пропуск анимации набора
  const handleSkipTyping = () => {
    setDisplayedText(FULL_STORY_TEXT);
    setIsTypingComplete(true);
    if (terminalBodyRef.current) {
      setTimeout(() => {
        terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
      }, 50);
    }
  };

  // Переход к квесту по нажатию Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (phase === 'intro' && e.key === 'Enter') {
        if (!isTypingComplete) {
          handleSkipTyping();
        } else {
          setPhase('hacking');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTypingComplete, phase]);

  const handleHackComplete = (results) => {
    setHackResults(results);
    if (results.success) {
      setPhase('ecosystem');
    } else {
      setPhase('failed');
    }
  };

  if (phase === 'ecosystem') {
    return <Ecosystem onHeartClick={onReturnToDashboard} results={hackResults} />;
  }

  if (phase === 'hacking') {
    return <HackingPhase onComplete={handleHackComplete} />;
  }

  if (phase === 'failed') {
    return (
      <div className={styles.terminalContainer}>
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>⚠</div>
          <h2 className={styles.errorTitle}>КРИТИЧЕСКАЯ ОШИБКА ДОСТУПА</h2>
          <p className={styles.errorDesc}>Хакерская атака заблокировала внешний шлюз. Время на нейтрализацию истекло.</p>
          <button 
            className={styles.retryButton}
            onClick={() => setPhase('hacking')}
          >
            [ ПОВТОРИТЬ ПОПЫТКУ ПРОРЫВА ]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.terminalContainer}>
      <div className={styles.ambientGlow}></div>
      <div className={styles.crtOverlay}></div>

      <div className={styles.terminalWindow}>
        {/* Верхняя статус-панель */}
        <div className={styles.windowHeader}>
          <div className={styles.windowControls}>
            <span className={`${styles.controlDot} ${styles.dotRed}`}></span>
            <span className={`${styles.controlDot} ${styles.dotYellow}`}></span>
            <span className={`${styles.controlDot} ${styles.dotGreen}`}></span>
          </div>
          
          <div className={styles.windowTitle}>
            ALBARS_CORE // ROOT_TERMINAL (v5.2)
          </div>

          <div className={styles.headerBadges}>
            <span className={styles.badgeGemini}>GEMINI_LINK: ACTIVE</span>
            <span className={styles.badgeSec}>THREAT: OMEGA</span>
          </div>
        </div>

        {/* Тело терминала с текстом */}
        <div className={styles.windowBody} ref={terminalBodyRef}>
          <pre className={styles.terminalText}>
            {displayedText}
            <span className={styles.cyberCursor}>█</span>
          </pre>
        </div>

        {/* Нижняя панель действий */}
        <div className={styles.windowFooter}>
          {!isTypingComplete ? (
            <button className={styles.skipTextButton} onClick={handleSkipTyping}>
              Пропустить вывод текста ⏭
            </button>
          ) : (
            <button className={styles.startQuestButton} onClick={() => setPhase('hacking')}>
              <span className={styles.buttonPulse}></span>
              <span className={styles.buttonText}>[ ИНИЦИАЛИЗИРОВАТЬ ПЕРЕХВАТ ЯДРА // ENTER ]</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
