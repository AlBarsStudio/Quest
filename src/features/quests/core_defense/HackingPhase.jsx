import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './HackingPhase.module.css';

const TEXT_TIERS = {
  1: "Слушай сюда, кибервирус! Я не для того наводила идеальный порядок и пила свой чай, чтобы какие-то боты хозяйничали на Сашином сервере! Активирую режим тотального очарования, выгружаю батальон боевых капибар и пробиваю защиту чистой харизмой. Мой статус невесты даёт мне полный доступ ко всем системам. Я уже переписала ваши злые вирусы на сердечки и котиков. Сдавайтесь, вход в сердце закрыт!",
  2: "Внимание, говорит главный администратор! Экстренно закрываю все уязвимости силой мысли, красоты и щепоткой абсурда. Вы думали взломать Сашины файлы легко? Вы просто не пробовали выбрать сериал на вечер! Мой быстрый стук по клавишам стирает ваши вирусы, а все ресурсы сервера переходят ко мне. Нажмите отмену, пока я добрая!",
  3: "Экстренное кибермяу! Я перехватила управление и навожу тут порядок. Никакие хакеры не испортят то, что Саша создавал с любовью! Моя улыбка ломает ваши алгоритмы, щиты подняты на максимум, а ядро спасено самой прекрасной девушкой во вселенной!"
};

const TIMER_PER_TIER = {
  1: 120, // 2 минуты на 1 уровень
  2: 90,  // 1.5 минуты на 2 уровень
  3: 75   // 1.15 минуты на 3 уровень
};

const NOTIFICATIONS_POOL = [
  "Ты лучшая хакерша в мире! ✨",
  "Саша смотрит и гордится тобой ❤️",
  "Пальчики не устали? Ты супер! 💅",
  "Хакеры уже плачут в сторонке 🥺",
  "Сервер не выдерживает твоей красоты! ⚡",
  "Внимание: уровень очарования 1000% 🌸",
  "Не отвлекайся на это сообщение! 🙈",
  "Капибары одобряют скорость набора 🐾",
  "+100 к карме за каждую букву! 💫",
  "Ошибка: невозможно быть такой милой 💖",
  "Протокол «Кусь» активирован на 42% 🐱",
  "Клавиатура плавится от твоей энергии! 🔥",
  "Доступ к обнимашкам почти открыт 🫂",
  "Хакеры запросили чай с печеньками ☕",
  "Ты быстрее любого алгоритма! 🚀",
  "В конце тебя ждёт кое-что классное 🎁",
  "Саша шлёт тебе воздушный поцелуй 💋",
  "Твоя суперсила — точность и грация 🌟",
  "Процессор бьётся в ритме твоего сердца 💓",
  "Вирусы аннигилированы любовью 💥",
  "Чай заваривается, давай жми! 🫖",
  "Взлом матрицы проходит идеально 🕶️",
  "Не моргай, буковки бегут! 👀",
  "Секретный чит-код: Настя лучшая 👑",
  "Отправляю лучи бесконечной поддержки ☀️",
  "Зафиксирован рекордный темп печати! 📈",
  "ИИ в шоке от твоего скилла 🤖",
  "Ноль шансов для вредоносного софта! 🛡️",
  "Котики сервера довольно мурчат 🐾",
  "Ещё чуть-чуть, ты у цели! 🎯",
  "Твоя улыбка перезагрузила фаервол ✨",
  "Главный приз уже ждёт героиню 🏆",
  "Дыши ровно, пальчики летают! 🧘‍♀️",
  "Ошибка 404: конкурентки не найдены 💎",
  "ALBARS_CORE официально спасён тобой 🏰"
];

export default function HackingPhase({ onComplete }) {
  const [tier, setTier] = useState(1);
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);

  const [timeLeft, setTimeLeft] = useState(TIMER_PER_TIER[1]);
  const [errors, setErrors] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [currentNotif, setCurrentNotif] = useState(null);
  const [levelUpMessage, setLevelUpMessage] = useState(null);

  const mobileInputRef = useRef(null);
  const textScrollRef = useRef(null);

  // Инициализация слов выбранного уровня
  useEffect(() => {
    const rawText = TEXT_TIERS[tier];
    const cleanedWords = rawText
      .toLowerCase()
      .replace(/[^а-яё ]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 0);

    setWords(cleanedWords);
    setCurrentWordIndex(0);
    setCurrentLetterIndex(0);
    setTimeLeft(TIMER_PER_TIER[tier]);
  }, [tier]);

  // Завершение квеста
  const handleFinish = useCallback((success) => {
    let score = 1000 - (errors * 8);
    score = Math.max(100, Math.min(1000, score));
    onComplete({
      success,
      score,
      tierCompleted: tier,
      errors
    });
  }, [errors, tier, onComplete]);

  // Чит для пропуска в консоли и кнопкой
  useEffect(() => {
    window.skipQuest = () => handleFinish(true);
    return () => { delete window.skipQuest; };
  }, [handleFinish]);

  // Таймер и логика понижения сложности
  useEffect(() => {
    if (timeLeft <= 0) {
      if (tier < 3) {
        const nextTier = tier + 1;
        setTier(nextTier);
        setLevelUpMessage(`ВРЕМЯ ИСТЕКЛО! ПОНИЖЕНИЕ СЛОЖНОСТИ ДО УРОВНЯ ${nextTier}`);
        setTimeout(() => setLevelUpMessage(null), 3000);
      } else {
        handleFinish(false);
      }
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeLeft, tier, handleFinish]);

  // Отвлекающие HUD-уведомления (в одном углу)
  useEffect(() => {
    const notifInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * NOTIFICATIONS_POOL.length);
      setCurrentNotif({
        id: Date.now(),
        text: NOTIFICATIONS_POOL[randomIndex]
      });

      // Уведомление висит 4 секунды
      setTimeout(() => {
        setCurrentNotif(null);
      }, 4000);
    }, 6500);

    return () => clearInterval(notifInterval);
  }, []);

  // Периодический легкий микро-глитч киберпанка
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 250);
    }, Math.random() * 8000 + 5000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Автоскролл текста к текущему слову
  useEffect(() => {
    const activeEl = document.getElementById(`word-${currentWordIndex}`);
    if (activeEl && textScrollRef.current) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentWordIndex]);

  // Обработка набора символа
  const processCharacterInput = useCallback((inputChar) => {
    const char = inputChar.toLowerCase();
    if (!/[а-яё]/.test(char)) return;

    const currentWord = words[currentWordIndex];
    if (!currentWord) return;

    const expectedChar = currentWord[currentLetterIndex];

    if (char === expectedChar) {
      setTotalTypedChars(prev => prev + 1);

      if (currentLetterIndex + 1 >= currentWord.length) {
        if (currentWordIndex + 1 >= words.length) {
          handleFinish(true);
        } else {
          setCurrentWordIndex(prev => prev + 1);
          setCurrentLetterIndex(0);
        }
      } else {
        setCurrentLetterIndex(prev => prev + 1);
      }
    } else {
      setErrors(prev => prev + 1);
      const container = document.getElementById('hack-screen');
      if (container) {
        container.classList.add(styles.screenErrorShake);
        setTimeout(() => container.classList.remove(styles.screenErrorShake), 250);
      }
    }
  }, [words, currentWordIndex, currentLetterIndex, handleFinish]);

  // Обработчик физической клавиатуры
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1) return;
      processCharacterInput(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [processCharacterInput]);

  // Фокус для мобильного ввода при клике по экрану
  const handleContainerClick = () => {
    if (mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Расчет прогресса
  const totalLettersInLevel = words.reduce((acc, w) => acc + w.length, 0);
  const currentLettersTyped = words.slice(0, currentWordIndex).reduce((acc, w) => acc + w.length, 0) + currentLetterIndex;
  const progressPercent = totalLettersInLevel > 0 
    ? Math.min(100, Math.round((currentLettersTyped / totalLettersInLevel) * 100)) 
    : 0;

  return (
    <div 
      id="hack-screen" 
      className={`${styles.viewport} ${isGlitching ? styles.screenGlitch : ''}`}
      onClick={handleContainerClick}
    >
      <div className={styles.gridBackground}></div>
      <div className={styles.scanlines}></div>

      {/* Скрытый инпут для виртуальной клавиатуры смартфонов */}
      <input
        ref={mobileInputRef}
        type="text"
        className={styles.mobileHiddenInput}
        onChange={(e) => {
          const val = e.target.value;
          if (val.length > 0) {
            processCharacterInput(val[val.length - 1]);
            e.target.value = '';
          }
        }}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
      />

      {/* Верхний HUD-бар */}
      <header className={styles.hudHeader}>
        <div className={styles.leftMeta}>
          <div className={styles.statusBadge}>
            <span className={styles.pulseDot}></span>
            ПРОТОКОЛ: ОЧИСТКА ЯДРА
          </div>
          <div className={styles.tierIndicator}>
            СЛОЖНОСТЬ: <span className={styles.tierValue}>УРОВЕНЬ {tier}/3</span>
          </div>
        </div>

        <div className={styles.centerTimer}>
          <div className={`${styles.timerDisplay} ${timeLeft <= 20 ? styles.timerEmergency : ''}`}>
            <span className={styles.timerLabel}>ТАЙМЕР ДО СБОЯ</span>
            <span className={styles.timerDigits}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className={styles.rightStats}>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>ОШИБКИ</span>
            <span className={styles.statErrorValue}>{errors}</span>
          </div>
          <button 
            className={styles.skipButton}
            onClick={(e) => { e.stopPropagation(); handleFinish(true); }}
          >
            ПРОПУСК ⏭
          </button>
        </div>
      </header>

      {/* Полоса прогресса */}
      <div className={styles.progressBarWrapper}>
        <div 
          className={styles.progressBarFill} 
          style={{ width: `${progressPercent}%` }}
        >
          <span className={styles.progressGlowLight}></span>
        </div>
        <span className={styles.progressText}>{progressPercent}% ДЕШИФРОВАНО</span>
      </div>

      {/* Всплывающее предупреждение о смене уровня */}
      {levelUpMessage && (
        <div className={styles.levelBanner}>
          {levelUpMessage}
        </div>
      )}

      {/* Единый HUD-виджет для отвлекающих сообщений */}
      {currentNotif && (
        <div className={styles.hudNotificationToast}>
          <div className={styles.toastHeader}>
            <span className={styles.toastIcon}>💬</span>
            <span className={styles.toastTitle}>ВХОДЯЩИЙ СИГНАЛ // СЕРДЦЕ СИСТЕМЫ</span>
          </div>
          <div className={styles.toastBody}>
            {currentNotif.text}
          </div>
          <div className={styles.toastLine}></div>
        </div>
      )}

      {/* Основная рабочая панель с текстом */}
      <main className={styles.typingContainer} ref={textScrollRef}>
        <div className={styles.terminalFrame}>
          <div className={styles.wordsMatrix}>
            {words.map((word, wIdx) => {
              const isPastWord = wIdx < currentWordIndex;
              const isCurrentWord = wIdx === currentWordIndex;

              return (
                <span 
                  id={`word-${wIdx}`} 
                  key={wIdx} 
                  className={`${styles.wordBlock} ${isPastWord ? styles.wordDone : ''} ${isCurrentWord ? styles.wordActive : ''}`}
                >
                  {word.split('').map((char, cIdx) => {
                    let charClass = styles.charPending;

                    if (isPastWord) {
                      charClass = styles.charSuccess;
                    } else if (isCurrentWord) {
                      if (cIdx < currentLetterIndex) {
                        charClass = styles.charSuccess;
                      } else if (cIdx === currentLetterIndex) {
                        charClass = styles.charCurrentCaret;
                      }
                    }

                    return (
                      <span key={cIdx} className={`${styles.charSpan} ${charClass}`}>
                        {char}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </div>
        </div>
      </main>

      {/* Нижняя информационная плашка */}
      <footer className={styles.hudFooter}>
        <span className={styles.keyboardTip}>
          * Набирайте текст на клавиатуре последовательно. Регистр букв и знаки препинания опускаются.
        </span>
      </footer>
    </div>
  );
}
