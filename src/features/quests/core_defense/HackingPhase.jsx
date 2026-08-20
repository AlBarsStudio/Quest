import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './HackingPhase.module.css';

const TEXT_TIERS = {
  1: "Слушай сюда, кибервирус! Я не для того наводила идеальный порядок и пила свой чай, чтобы какие-то боты хозяйничали на Сашином сервере! Активирую режим тотального очарования, выгружаю батальон боевых капибар и пробиваю защиту чистой харизмой. Мой статус невесты даёт мне полный доступ ко всем системам. Я уже переписала ваши злые вирусы на сердечки и котиков. Сдавайтесь, вход в сердце закрыт!",
  2: "Внимание, говорит главный администратор! Экстренно закрываю все уязвимости силой мысли, красоты и щепоткой абсурда. Вы думали взломать Сашины файлы легко? Вы просто не пробовали выбрать сериал на вечер! Мой быстрый стук по клавишам стирает ваши вирусы, а все ресурсы сервера переходят ко мне. Нажмите отмену, пока я добрая!",
  3: "Экстренное кибермяу! Я перехватила управление и навожу тут порядок. Никакие хакеры не испортят то, что Саша создавал с любовью! Моя улыбка ломает ваши алгоритмы, щиты подняты на максимум, а ядро спасено самой прекрасной девушкой во вселенной!"
};

const DURATION_SECONDS = 180; // 3 минуты на каждый уровень
const STORAGE_KEY = 'albars_hacking_progress_v2';

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

const parseWords = (text) => {
  return text
    .toLowerCase()
    .replace(/[^а-яё ]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0);
};

export default function HackingPhase({ onComplete }) {
  // 1. Проверка сохранения в LocalStorage (не старше 60 секунд)
  const [savedData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.timestamp < 60000) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem(STORAGE_KEY);
    return null;
  });

  const [tier, setTier] = useState(() => savedData?.tier || 1);
  const [words, setWords] = useState(() => parseWords(TEXT_TIERS[savedData?.tier || 1]));
  const [currentWordIndex, setCurrentWordIndex] = useState(() => savedData?.currentWordIndex || 0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(() => savedData?.currentLetterIndex || 0);
  const [timeLeft, setTimeLeft] = useState(() => savedData?.timeLeft || DURATION_SECONDS);
  const [errors, setErrors] = useState(() => savedData?.errors || 0);

  const [isFlipped, setIsFlipped] = useState(false);
  const [hasFlippedThisTier, setHasFlippedThisTier] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [currentNotif, setCurrentNotif] = useState(null);
  const [tierChangeBanner, setTierChangeBanner] = useState(null);
  
  // Состояния для динамического интерактива
  const [isTypingActive, setIsTypingActive] = useState(false);
  const [hexDump, setHexDump] = useState('0x7F 0xA4 0x12 0xEE 0x90 0xBC');

  const mobileInputRef = useRef(null);
  const textScrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const canvas3dRef = useRef(null);

  // 2. Сохранение прогресса
  useEffect(() => {
    const dataToSave = {
      tier,
      currentWordIndex,
      currentLetterIndex,
      timeLeft,
      errors,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [tier, currentWordIndex, currentLetterIndex, timeLeft, errors]);

  // Завершение квеста
  const handleFinish = useCallback((success) => {
    localStorage.removeItem(STORAGE_KEY);
    let score = 1000 - (errors * 5);
    score = Math.max(150, Math.min(1000, score));
    onComplete({
      success,
      score,
      tierCompleted: tier,
      errors
    });
  }, [errors, tier, onComplete]);

  // Чит-код
  useEffect(() => {
    window.skipQuest = () => handleFinish(true);
    return () => { delete window.skipQuest; };
  }, [handleFinish]);

  // Переход на следующий уровень сложности
  const advanceToNextTier = useCallback((nextTierNumber) => {
    setTier(nextTierNumber);
    setWords(parseWords(TEXT_TIERS[nextTierNumber]));
    setCurrentWordIndex(0);
    setCurrentLetterIndex(0);
    setTimeLeft(DURATION_SECONDS);
    setHasFlippedThisTier(false);
    setIsFlipped(false);
    setTierChangeBanner(`ВРЕМЯ ВЫШЛО! ПЕРЕХОД К УРОВНЮ ${nextTierNumber} ИЗ 3`);
    setTimeout(() => setTierChangeBanner(null), 4000);
  }, []);

  // 3. Таймер, переворот экрана и смена уровней 1 -> 2 -> 3
  useEffect(() => {
    if (timeLeft <= 0) {
      if (tier === 1) {
        advanceToNextTier(2);
      } else if (tier === 2) {
        advanceToNextTier(3);
      } else {
        handleFinish(false);
      }
      return;
    }

    // Переворот экрана на 60 секунде ровно на 5 секунд
    if (timeLeft === 60 && !hasFlippedThisTier) {
      setIsFlipped(true);
      setHasFlippedThisTier(true);
      setTimeout(() => {
        setIsFlipped(false);
      }, 5000);
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, tier, hasFlippedThisTier, advanceToNextTier, handleFinish]);

  // Генератор живого HEX-дампа (работает когда игрок печатает)
  useEffect(() => {
    if (!isTypingActive) return;
    const chars = '0123456789ABCDEF';
    const interval = setInterval(() => {
      let res = '';
      for (let i = 0; i < 6; i++) {
        res += '0x' + chars[Math.floor(Math.random() * 16)] + chars[Math.floor(Math.random() * 16)] + ' ';
      }
      setHexDump(res.trim());
    }, 90);
    return () => clearInterval(interval);
  }, [isTypingActive]);

  // 4. Отрисовка интерактивной 3D-голограммы (Октаэдр с вращением)
  useEffect(() => {
    const canvas = canvas3dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let angleX = 0;
    let angleY = 0;

    // Вершины 3D октаэдра
    const vertices = [
      [0, 1.2, 0], [0, -1.2, 0],
      [1.2, 0, 0], [-1.2, 0, 0],
      [0, 0, 1.2], [0, 0, -1.2]
    ];

    const edges = [
      [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 2], [1, 3], [1, 4], [1, 5],
      [2, 4], [4, 3], [3, 5], [5, 2]
    ];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const speed = isTypingActive ? 0.05 : 0.015;
      angleX += speed;
      angleY += speed * 0.8;

      const size = canvas.width / 2;
      const fov = 160;

      const projected = vertices.map(([x, y, z]) => {
        // Вращение X и Y
        let radX = angleX;
        let y1 = y * Math.cos(radX) - z * Math.sin(radX);
        let z1 = y * Math.sin(radX) + z * Math.cos(radX);

        let radY = angleY;
        let x2 = x * Math.cos(radY) + z1 * Math.sin(radY);
        let z2 = -x * Math.sin(radY) + z1 * Math.cos(radY);

        let scale = fov / (fov + z2 + 2);
        return [
          x2 * scale * 26 + size,
          y1 * scale * 26 + size
        ];
      });

      // Рендер ребер
      ctx.strokeStyle = isTypingActive ? '#ff8c00' : 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = isTypingActive ? 2 : 1.2;
      ctx.shadowBlur = isTypingActive ? 12 : 4;
      ctx.shadowColor = '#f59e0b';

      edges.forEach(([i, j]) => {
        ctx.beginPath();
        ctx.moveTo(projected[i][0], projected[i][1]);
        ctx.lineTo(projected[j][0], projected[j][1]);
        ctx.stroke();
      });

      // Рендер узлов
      projected.forEach(([px, py]) => {
        ctx.fillStyle = '#ffedd5';
        ctx.beginPath();
        ctx.arc(px, py, isTypingActive ? 2.5 : 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isTypingActive]);

  // HUD-уведомления
  useEffect(() => {
    const notifInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * NOTIFICATIONS_POOL.length);
      setCurrentNotif({
        id: Date.now(),
        text: NOTIFICATIONS_POOL[randomIndex]
      });

      setTimeout(() => {
        setCurrentNotif(null);
      }, 4000);
    }, 6500);

    return () => clearInterval(notifInterval);
  }, []);

  // Автоскролл к текущему слову
  useEffect(() => {
    const activeEl = document.getElementById(`word-${currentWordIndex}`);
    if (activeEl && textScrollRef.current) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentWordIndex]);

  // 5. Обработка набора с инвертированным подсвечиванием
  const processInputChar = useCallback((inputChar) => {
    const char = inputChar.toLowerCase();
    if (!/[а-яё]/.test(char)) return;

    const currentWord = words[currentWordIndex];
    if (!currentWord) return;

    // Активируем статус печати для анимаций HEX и 3D
    setIsTypingActive(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTypingActive(false), 900);

    // Сверяем ввод: игрок нажимает символы слова по порядку (п -> р -> и -> в -> е -> т)
    const expectedChar = currentWord[currentLetterIndex];

    if (char === expectedChar) {
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
      const container = document.getElementById('hack-viewport');
      if (container) {
        container.classList.add(styles.errorFlash);
        setTimeout(() => container.classList.remove(styles.errorFlash), 200);
      }
    }
  }, [words, currentWordIndex, currentLetterIndex, handleFinish]);

  // Слушатель клавиатуры ПК
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1) return;
      processInputChar(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [processInputChar]);

  // Фокусировка скрытого инпута для мобильных
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
  const totalLetters = words.reduce((acc, w) => acc + w.length, 0);
  const typedLetters = words.slice(0, currentWordIndex).reduce((acc, w) => acc + w.length, 0) + currentLetterIndex;
  const progressPercent = totalLetters > 0 ? Math.min(100, Math.round((typedLetters / totalLetters) * 100)) : 0;

  return (
    <div 
      id="hack-viewport"
      className={`${styles.viewport} ${isGlitching ? styles.glitchEffect : ''} ${isFlipped ? styles.flippedScreen : ''}`}
      onClick={handleContainerClick}
    >
      <div className={styles.gridOverlay}></div>
      <div className={styles.scanlines}></div>

      {/* Невидимый инпут для вызова клавиатуры на смартфонах */}
      <input
        ref={mobileInputRef}
        type="text"
        className={styles.hiddenMobileInput}
        onChange={(e) => {
          const val = e.target.value;
          if (val.length > 0) {
            processInputChar(val[val.length - 1]);
            e.target.value = '';
          }
        }}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
      />

      {/* Верхний HUD */}
      <header className={styles.hudHeader}>
        <div className={styles.hudLeft}>
          <div className={styles.holoWidget}>
            <canvas ref={canvas3dRef} width="70" height="70" className={styles.holoCanvas} />
          </div>
          <div className={styles.metaInfo}>
            <div className={styles.badgeProtocol}>
              <span className={styles.pulseDot}></span>
              ALBARS_CORE // ПЕРЕХВАТ
            </div>
            <div className={styles.badgeTier}>
              СЛОЖНОСТЬ: <span className={styles.tierHighlight}>{tier} ИЗ 3</span>
            </div>
          </div>
        </div>

        {/* Центральный интерактивный блок HEX-памяти */}
        <div className={styles.hudCenter}>
          <div className={styles.hexBox}>
            <div className={styles.hexHeader}>
              <span className={styles.hexTitle}>RAM STREAM</span>
              <span className={`${styles.hexStatus} ${isTypingActive ? styles.hexActive : ''}`}>
                {isTypingActive ? 'BUFFERING' : 'IDLE'}
              </span>
            </div>
            <div className={styles.hexText}>{hexDump}</div>
          </div>

          <div className={`${styles.timerCard} ${timeLeft <= 60 ? styles.timerWarning : ''}`}>
            <span className={styles.timerSub}>ДО СБОЯ</span>
            <span className={styles.timerTime}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className={styles.hudRight}>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>ОШИБКИ</span>
            <span className={styles.statVal}>{errors}</span>
          </div>
          <button 
            className={styles.skipBtn}
            onClick={(e) => { e.stopPropagation(); handleFinish(true); }}
          >
            ПРОПУСК ⏭
          </button>
        </div>
      </header>

      {/* Прогресс-бар */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progressPercent}%` }}>
          <div className={styles.progressGlow}></div>
        </div>
        <span className={styles.progressValue}>{progressPercent}% ДЕШИФРОВАНО</span>
      </div>

      {/* Предупреждение о смене уровня */}
      {tierChangeBanner && (
        <div className={styles.bannerContainer}>
          <span className={styles.bannerIcon}>⚠️</span>
          {tierChangeBanner}
        </div>
      )}

      {/* HUD-уведомление */}
      {currentNotif && (
        <div className={styles.toastWidget}>
          <div className={styles.toastHead}>
            <span>💖 ВХОДЯЩИЙ СИГНАЛ</span>
          </div>
          <div className={styles.toastBody}>
            {currentNotif.text}
          </div>
          <div className={styles.toastBar}></div>
        </div>
      )}

      {/* Рабочая область печати */}
      <main className={styles.typingArea} ref={textScrollRef}>
        <div className={styles.matrixBox}>
          <div className={styles.textMatrix}>
            {words.map((word, wIdx) => {
              const isPastWord = wIdx < currentWordIndex;
              const isCurrentWord = wIdx === currentWordIndex;

              return (
                <span 
                  id={`word-${wIdx}`} 
                  key={wIdx} 
                  className={`${styles.word} ${isPastWord ? styles.wordFinished : ''} ${isCurrentWord ? styles.wordCurrent : ''}`}
                >
                  {word.split('').map((char, cIdx) => {
                    let charState = styles.charGhost;

                    if (isPastWord) {
                      charState = styles.charDone;
                    } else if (isCurrentWord) {
                      // Зеркальное отображение: вводя п-р-и-в-е-т символы загораются с конца слова
                      const reversedIndex = (word.length - 1) - cIdx;
                      if (reversedIndex < currentLetterIndex) {
                        charState = styles.charDone;
                      } else if (reversedIndex === currentLetterIndex) {
                        charState = styles.charCaret;
                      }
                    }

                    return (
                      <span key={cIdx} className={`${styles.char} ${charState}`}>
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
        <div className={styles.mobileFocusPrompt} onClick={handleContainerClick}>
          📱 Нажмите сюда, если клавиатура закрылась
        </div>
        <span className={styles.footerHint}>
          * Аномалия ядра: ввод символов инвертирован. Набирайте слова в стандартном порядке слева направо.
        </span>
      </footer>
    </div>
  );
}
