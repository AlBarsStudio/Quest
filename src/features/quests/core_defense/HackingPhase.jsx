import { useState, useEffect, useCallback } from 'react';
import styles from './HackingPhase.module.css';

const TEXTS = [
  "Слушай сюда, кибер-вирус, я не для того сегодня делала укладку, чтобы ты ковырялся в Сашиных файлах! Запускаю протокол 'Кусь' и пробиваю ваш фаервол своей невероятной харизмой. Если вы думали, что эту систему легко взломать, то вы просто не видели, как я выбираю, что мы будем смотреть вечером. Моя любовь генерирует криптографический ключ такой мощности, что ваши сервера сейчас просто расплавятся от умиления. Я забираю управление на себя, доступ к сердцу разрешен!",
  "Внимание, говорит главнокомандующая пушистого спецназа Настя! Экстренно выгружаю боевых капибар прямо в оперативную память. Эти злые хакеры хотят украсть наши данные? Ну уж нет, я лучше сама их случайно удалю! Ладно, шучу. Я героически стучу по клавиатуре, взламывая матрицу с помощью магии, красоты и щепотки тотального абсурда. Мой статус невесты дает мне право форматировать мозги любому трояну. Система, открой мне дверь, иначе я применю секретное оружие!",
  "Экстренное кибер-мяу! Я пробралась в исходный код и навожу тут свои порядки. Какого черта вы лезете в Сашино хранилище? Тут всё зарезервировано исключительно для меня! Прямо сейчас я меняю ваш бинарный код на сердечки и звездочки. Пусть хакеры видят, с кем связались. Моя милота вызывает фатальную ошибку в вашем вредоносном софте. Перенаправляю всю энергию сервера на генерацию бесконечной любви. Взлом проходит успешно, я самая гениальная хакерша в этой вселенной!"
];

const CUTE_NOTIFS = [
  "Ты умничка! ❤️",
  "Саша верит в тебя! ✨",
  "Взлом матриц... 🌸",
  "Почти готово! 🐈",
  "Не сдавайся! 💕"
];

export default function HackingPhase({ onComplete }) {
  const [originalText] = useState(() => TEXTS[Math.floor(Math.random() * TEXTS.length)]);
  
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0); 
  
  const [timeLeft, setTimeLeft] = useState(180);
  const [errors, setErrors] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const cleanWords = originalText
      .toLowerCase()
      .replace(/[^а-яё ]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 0);
    setWords(cleanWords);
  }, [originalText]);

  // Таймер и переворот экрана
  useEffect(() => {
    if (timeLeft <= 0) {
      handleGameOver(false);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    
    // Переворот на 60 секундах
    if (timeLeft === 60) {
      setIsFlipped(true);
      setTimeout(() => setIsFlipped(false), 5000); // Возврат через 5 секунд
    }
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Всплывающие уведомления
  useEffect(() => {
    const notifTimer = setInterval(() => {
      const newNotif = {
        id: Date.now(),
        text: CUTE_NOTIFS[Math.floor(Math.random() * CUTE_NOTIFS.length)],
        top: Math.floor(Math.random() * 80) + 10 + '%',
        left: Math.floor(Math.random() * 80) + 10 + '%',
      };
      setNotifications(prev => [...prev, newNotif]);
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
      }, 3000);
    }, 6000); // Каждые 6 секунд
    return () => clearInterval(notifTimer);
  }, []);

  useEffect(() => {
    const glitchTimer = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, Math.random() * 5000 + 3000);
    return () => clearInterval(glitchTimer);
  }, []);

  const handleGameOver = useCallback((success) => {
    let score = 1000;
    score -= (errors * 5);
    const timeTaken = 180 - timeLeft;
    if (timeTaken > 120) {
      score -= ((timeTaken - 120) * 2); 
    }
    score = Math.max(0, Math.min(1000, score));
    onComplete({ success, score, timeTaken, errors });
  }, [errors, timeLeft, onComplete]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1) return;
      
      const typedChar = e.key.toLowerCase();
      if (!/[а-яё]/.test(typedChar)) return;

      const currentWord = words[currentWordIndex];
      if (!currentWord) return;

      const expectedChar = currentWord[currentLetterIndex];

      if (typedChar === expectedChar) {
        if (currentLetterIndex + 1 >= currentWord.length) {
          if (currentWordIndex + 1 >= words.length) {
            handleGameOver(true);
          } else {
            setCurrentWordIndex(prev => prev + 1);
            setCurrentLetterIndex(0);
          }
        } else {
          setCurrentLetterIndex(prev => prev + 1);
        }
      } else {
        setErrors(prev => prev + 1);
        const container = document.getElementById('hack-container');
        if (container) {
          container.classList.add(styles.errorFlash);
          setTimeout(() => container.classList.remove(styles.errorFlash), 300);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [words, currentWordIndex, currentLetterIndex, handleGameOver]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const renderWords = () => {
    return words.map((word, wIdx) => {
      let wordStatus = '';
      if (wIdx < currentWordIndex) wordStatus = styles.wordCompleted;
      else if (wIdx === currentWordIndex) wordStatus = styles.wordCurrent;
      else wordStatus = styles.wordPending;

      return (
        <span key={wIdx} className={`${styles.word} ${wordStatus}`}>
          {word.split('').map((char, cIdx) => {
            // Текст теперь ВИДЕН (показываем char всегда), но стиль меняется
            let displayChar = char; 
            let charStatus = styles.charPending; // Полупрозрачный по умолчанию

            if (wIdx < currentWordIndex) {
              charStatus = styles.charCompleted;
            } else if (wIdx === currentWordIndex) {
              const reversedIndex = (word.length - 1) - cIdx;
              if (reversedIndex < currentLetterIndex) {
                 charStatus = styles.charTyped;
              }
            }

            return <span key={cIdx} className={charStatus}>{displayChar}</span>;
          })}
          {' '}
        </span>
      );
    });
  };

  return (
    <div id="hack-container" className={`${styles.container} ${isGlitching ? styles.glitchEffect : ''} ${isFlipped ? styles.flipped : ''}`}>
      
      <header className={styles.header}>
        <div className={styles.warning}>[ ВТОРЖЕНИЕ: ПРОТОКОЛ ПЕРЕКАЛИБРОВКИ ]</div>
        <div className={styles.timerContainer}>
          <div className={`${styles.timer} ${timeLeft <= 60 ? styles.timerDanger : ''}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className={styles.stats}>
          Ошибки: <span className={styles.errorCount}>{errors}</span>
        </div>
      </header>

      <main className={styles.textContainer}>
        {renderWords()}
      </main>

      <footer className={styles.instructions}>
        * Аномалия ядра: ввод символов инвертирован. Набирайте текст последовательно.
      </footer>

      {notifications.map(n => (
        <div key={n.id} className={styles.cuteNotification} style={{ top: n.top, left: n.left }}>
          {n.text}
        </div>
      ))}
    </div>
  );
}
