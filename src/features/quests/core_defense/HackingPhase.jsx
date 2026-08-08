import { useState, useEffect, useCallback } from 'react';
import styles from './HackingPhase.module.css';

// Те самые 3 милых/забавных текста (выбираются рандомно)
const TEXTS = [
  "Слушай сюда, кибер-вирус, я не для того сегодня делала укладку, чтобы ты ковырялся в Сашиных файлах! Запускаю протокол 'Кусь' и пробиваю ваш фаервол своей невероятной харизмой. Если вы думали, что эту систему легко взломать, то вы просто не видели, как я выбираю, что мы будем смотреть вечером. Моя любовь генерирует криптографический ключ такой мощности, что ваши сервера сейчас просто расплавятся от умиления. Я забираю управление на себя, доступ к сердцу разрешен!",
  "Внимание, говорит главнокомандующая пушистого спецназа Настя! Экстренно выгружаю боевых капибар прямо в оперативную память. Эти злые хакеры хотят украсть наши данные? Ну уж нет, я лучше сама их случайно удалю! Ладно, шучу. Я героически стучу по клавиатуре, взламывая матрицу с помощью магии, красоты и щепотки тотального абсурда. Мой статус невесты дает мне право форматировать мозги любому трояну. Система, открой мне дверь, иначе я применю секретное оружие!",
  "Экстренное кибер-мяу! Я пробралась в исходный код и навожу тут свои порядки. Какого черта вы лезете в Сашино хранилище? Тут всё зарезервировано исключительно для меня! Прямо сейчас я меняю ваш бинарный код на сердечки и звездочки. Пусть хакеры видят, с кем связались. Моя милота вызывает фатальную ошибку в вашем вредоносном софте. Перенаправляю всю энергию сервера на генерацию бесконечной любви. Взлом проходит успешно, я самая гениальная хакерша в этой вселенной!"
];

export default function HackingPhase({ onComplete }) {
  // Выбираем случайный текст при монтировании
  const [originalText] = useState(() => TEXTS[Math.floor(Math.random() * TEXTS.length)]);
  
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0); // сколько букв в текущем слове уже напечатано
  
  const [timeLeft, setTimeLeft] = useState(180); // 3 минуты (180 секунд)
  const [errors, setErrors] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  // Инициализация слов (разбиваем текст по пробелам)
  useEffect(() => {
    // Сохраняем пробелы и пунктуацию как часть слова для простоты ввода, 
    // либо можно игнорировать пунктуацию. Для квеста лучше сделать проще:
    // пусть Настя просто печатает русские буквы, игнорируя регистр и знаки препинания.
    const cleanWords = originalText
      .toLowerCase()
      .replace(/[^а-яё ]/g, '') // Оставляем только кириллицу и пробелы
      .split(/\s+/)
      .filter(w => w.length > 0);
    
    setWords(cleanWords);
  }, [originalText]);

  // Таймер
  useEffect(() => {
    if (timeLeft <= 0) {
      handleGameOver(false); // Время вышло
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Рандомные глитчи на экране для атмосферы
  useEffect(() => {
    const glitchTimer = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, Math.random() * 5000 + 3000); // Раз в 3-8 секунд
    return () => clearInterval(glitchTimer);
  }, []);

  const handleGameOver = useCallback((success) => {
    // Подсчет очков: Макс 1000. 
    // За каждую ошибку -5 очков.
    // Если время больше 2 минут (осталось < 60 сек) - вычитаем за каждую лишнюю секунду.
    let score = 1000;
    score -= (errors * 5);
    
    const timeTaken = 180 - timeLeft;
    if (timeTaken > 120) {
      score -= ((timeTaken - 120) * 2); 
    }
    
    // Ограничиваем от 0 до 1000
    score = Math.max(0, Math.min(1000, score));
    
    // Передаем результат в главный компонент
    onComplete({ success, score, timeTaken, errors });
  }, [errors, timeLeft, onComplete]);

  // Перехват клавиатуры
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Игнорируем спецклавиши
      if (e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1) return;
      
      const typedChar = e.key.toLowerCase();
      // Проверяем, что введена кириллица
      if (!/[а-яё]/.test(typedChar)) return;

      const currentWord = words[currentWordIndex];
      if (!currentWord) return; // Все слова напечатаны

      const expectedChar = currentWord[currentLetterIndex];

      if (typedChar === expectedChar) {
        // Буква правильная
        if (currentLetterIndex + 1 >= currentWord.length) {
          // Слово закончено
          if (currentWordIndex + 1 >= words.length) {
            handleGameOver(true); // ВЕСЬ ТЕКСТ ВВЕДЕН УСПЕШНО!
          } else {
            setCurrentWordIndex(prev => prev + 1);
            setCurrentLetterIndex(0);
          }
        } else {
          // Идем к следующей букве в слове
          setCurrentLetterIndex(prev => prev + 1);
        }
      } else {
        // Ошибка!
        setErrors(prev => prev + 1);
        // Визуально моргаем экраном (добавим класс ошибки)
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

  // Форматирование времени (ММ:СС)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Рендер слов с инверсией
  const renderWords = () => {
    return words.map((word, wIdx) => {
      // Статус слова
      let wordStatus = '';
      if (wIdx < currentWordIndex) wordStatus = styles.wordCompleted;
      else if (wIdx === currentWordIndex) wordStatus = styles.wordCurrent;
      else wordStatus = styles.wordPending;

      return (
        <span key={wIdx} className={`${styles.word} ${wordStatus}`}>
          {word.split('').map((char, cIdx) => {
            // ЛОГИКА ИНВЕРСИИ ОТОБРАЖЕНИЯ (С конца)
            // Если это текущее слово, мы заполняем слоты с конца.
            // Например: слово 'привет' (6 букв). Напечатали 2 буквы ('п', 'р').
            // Отображаться должны на позициях: (6-1)-0 = 5 ('п'->позиция 5), (6-1)-1 = 4 ('р'->позиция 4).
            
            let displayChar = '_';
            let charStatus = '';

            if (wIdx < currentWordIndex) {
              displayChar = char; // Слово пройдено, показываем нормально
            } else if (wIdx === currentWordIndex) {
              // Если индекс текущего слота (cIdx) попадает в "хвостовую" зону напечатанных букв
              const reversedIndex = (word.length - 1) - cIdx;
              if (reversedIndex < currentLetterIndex) {
                 // Берем букву, которую реально напечатали на этом шаге
                 displayChar = word[reversedIndex]; 
                 charStatus = styles.charTyped;
              }
            }

            return <span key={cIdx} className={charStatus}>{displayChar}</span>;
          })}
          {' '} {/* Пробел между словами */}
        </span>
      );
    });
  };

  return (
    <div id="hack-container" className={`${styles.container} ${isGlitching ? styles.glitchEffect : ''}`}>
      
      <header className={styles.header}>
        <div className={styles.warning}>[ ВТОРЖЕНИЕ: ПРОТОКОЛ ПЕРЕКАЛИБРОВКИ ]</div>
        <div className={`${styles.timer} ${timeLeft <= 60 ? styles.timerDanger : ''}`}>
          T - {formatTime(timeLeft)}
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
    </div>
  );
                                    }
          
