import React, { useState } from 'react';
import styles from './Intro.module.css';

export default function Intro({ onComplete }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStart = () => {
    // Здесь позже добавим включение музыки
    // const audio = new Audio('/intro-theme.mp3');
    // audio.play();
    setIsPlaying(true);
    
    // Эффект "выключения экрана" перед переходом
    setTimeout(() => {
      onComplete();
    }, 1000); // Переход в дашборд через секунду после клика
  };

  return (
    <div className={styles.introContainer}>
      <div className={styles.systemText}>
        <p>[ СИСТЕМА ИНИЦИАЛИЗИРОВАНА ]</p>
        <p>Калибровка уровня паники... ОК</p>
        <p>Загрузка абсурдных сценариев... ОК</p>
      </div>

      <h1 className={styles.mainTitle}>Привет, Настя.</h1>
      <p className={styles.subtitle}>Добро пожаловать в симуляцию.</p>

      <button className={styles.startButton} onClick={handleStart}>
        {isPlaying ? 'ЗАГРУЗКА...' : 'ВОЙТИ'}
      </button>
    </div>
  );
}
