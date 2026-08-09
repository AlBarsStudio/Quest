import { useState, useEffect, useRef } from 'react';
import styles from './Intro.module.css';
// import introMusic from '../../assets/intro-theme.mp3'; 

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
    // if (audioRef.current) audioRef.current.play();
  };

  useEffect(() => {
    if (!isStarted) return;
    
    if (currentScene >= scenes.length) {
      onComplete(); 
      return;
    }

    const timer = setTimeout(() => {
      setCurrentScene(prev => prev + 1);
    }, scenes[currentScene].duration);

    return () => clearTimeout(timer);
  }, [isStarted, currentScene, onComplete]);

  return (
    <div className={styles.introContainer}>
      {/* <audio ref={audioRef} src={introMusic} preload="auto" /> */}
      
      {/* Временная кнопка пропуска */}
      <button 
        onClick={onComplete}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '8px 16px',
          cursor: 'pointer',
          borderRadius: '4px',
          zIndex: 100,
          fontFamily: 'monospace'
        }}
      >
        Пропустить интро ⏭
      </button>

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
