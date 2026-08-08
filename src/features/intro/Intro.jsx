import { useState, useEffect, useRef } from 'react';
import styles from './Intro.module.css';
// import introMusic from '../../assets/intro-theme.mp3'; // Раскомментируй, когда добавишь файл музыки

const scenes = [
  { text: "AlBars Studio представляет", styleClass: styles.fadeScale, duration: 4000 },
  { text: "При поддержке Gemini AI", styleClass: styles.swipeOut, duration: 3000 },
  { text: "Проект, который не должен был существовать...", styleClass: styles.focusIn, duration: 4000 },
  { text: "Бюджет: 3 чашки кофе, сломанный режим сна и пара нервных клеток", styleClass: styles.dropFall, duration: 5000 },
  { text: "Главная и единственная героиня симуляции:", styleClass: styles.fadeScale, duration: 4000 },
  { text: "Анастасия", styleClass: styles.typewriter, duration: 4500 },
  { text: "Добро пожаловать в хаос.", styleClass: styles.glitch, duration: 2500 }
];

export default function Intro({ onComplete }) {
  const [isStarted, setIsStarted] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const audioRef = useRef(null);

  const handleStart = () => {
    setIsStarted(true);
    // if (audioRef.current) audioRef.current.play(); // Раскомментируй для музыки
  };

  useEffect(() => {
    // Если не началось или сцены кончились - ничего не делаем
    if (!isStarted) return;
    
    if (currentScene >= scenes.length) {
      onComplete(); // Вызываем завершение интро
      return;
    }

    // Таймер переключения сцен
    const timer = setTimeout(() => {
      setCurrentScene(prev => prev + 1);
    }, scenes[currentScene].duration);

    return () => clearTimeout(timer);
  }, [isStarted, currentScene, onComplete]);

  return (
    <div className={styles.introContainer}>
      {/* <audio ref={audioRef} src={introMusic} preload="auto" /> */}
      
      {!isStarted ? (
        <button className={styles.startButton} onClick={handleStart}>
          Запустить симуляцию
        </button>
      ) : (
        currentScene < scenes.length && (
          <div key={currentScene} className={`${styles.sceneText} ${scenes[currentScene].styleClass}`}>
            {scenes[currentScene].text}
          </div>
        )
      )}
    </div>
  );
}
