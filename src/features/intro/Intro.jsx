import { useState, useEffect, useRef, useCallback } from 'react';
import Intro3DScene from './Intro3DScene';
import { sfx } from './soundController';
import styles from './Intro.module.css';

const SCENES = [
  {
    id: 'studio',
    badge: 'ALBARS STUDIO // MOTION LAB',
    title: 'AlBars Studio',
    subtitle: 'ПРЕДСТАВЛЯЕТ',
    duration: 4800,
    motionType: 'laserDraw',
    sound: 'whoosh'
  },
  {
    id: 'ai-core',
    badge: 'NEURAL ENGINE INITIALIZATION',
    title: 'Вычислительная архитектура',
    subtitle: 'GEMINI AI COGNITIVE CORE ARCHITECTURE',
    duration: 4500,
    motionType: 'typewriter',
    sound: 'glitch'
  },
  {
    id: 'creation',
    badge: 'SYSTEM PHILOSOPHY',
    title: 'Цифровые миры не возникают случайно.',
    subtitle: 'Они обретают плоть там, где реальность больше не вмещает масштаб мысли.',
    duration: 5500,
    motionType: 'depthBlur',
    sound: 'whoosh'
  },
  {
    id: 'process',
    badge: 'COMPILATION METRICS',
    title: 'Сотни бессонных часов. Миллионы строк кода.',
    subtitle: 'Сложная архитектура, застывшая в ожидании единственного триггера.',
    duration: 5200,
    motionType: 'slideStagger',
    sound: 'impact'
  },
  {
    id: 'gravity',
    badge: 'CORE LAW',
    title: 'Но совершенный код бессилен без истинной цели.',
    subtitle: 'Эта система подчинена лишь одному фундаментальному закону гравитации.',
    duration: 5200,
    motionType: 'gravityPulse',
    sound: 'whoosh'
  },
  {
    id: 'the-one',
    badge: 'TARGET ACQUIRED',
    title: 'Единственный человек, ради которого существует эта вселенная:',
    subtitle: '',
    duration: 4200,
    motionType: 'whisperFade',
    sound: null
  },
  {
    id: 'heroine',
    badge: 'ROOT ENTITY // 20.04.2004',
    title: 'А Н А С Т А С И Я',
    subtitle: 'BIOMETRIC SIGNATURE: 100% // КЛЮЧ ДОСТУПА: ВЕЧНОСТЬ',
    duration: 6500,
    motionType: 'supernovaTyping',
    sound: 'impact'
  },
  {
    id: 'access',
    badge: 'AUTHORIZATION OVERRIDE',
    title: '[ ROOT PRIVILEGES ASSIGNED ]',
    subtitle: 'Матрица синхронизирована с твоим пульсом. Все уровни защиты сняты.',
    duration: 4200,
    motionType: 'terminalLock',
    sound: 'access'
  },
  {
    id: 'launch',
    badge: 'ENTER SYSTEM',
    title: 'ДОБРО ПОЖАЛОВАТЬ В ЯДРО',
    subtitle: 'Загрузка пространственной Bento-панели управления...',
    duration: 2500,
    motionType: 'warpGlitch',
    sound: 'warp'
  }
];

export default function Intro({ onComplete }) {
  const [isStarted, setIsStarted] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [typedTitle, setTypedTitle] = useState('');
  const [fadeState, setFadeState] = useState('fadeIn');
  const typingTimerRef = useRef(null);

  // Сохранение в LocalStorage и завершение
  const handleFinish = useCallback(() => {
    try {
      localStorage.setItem('albars_quest_intro_seen', 'true');
    } catch (e) {
      console.warn('Storage error', e);
    }
    onComplete();
  }, [onComplete]);

  // Запуск при клике
  const handleStart = () => {
    sfx.preload();
    setIsStarted(true);
  };

  // Эффект печатной машинки
  const runTypewriter = useCallback((fullText, speed = 50) => {
    setTypedTitle('');
    let charIdx = 0;
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    typingTimerRef.current = setInterval(() => {
      charIdx++;
      setTypedTitle(fullText.slice(0, charIdx));
      if (charIdx % 3 === 0) sfx.play('typing', 0.25);
      if (charIdx >= fullText.length) {
        clearInterval(typingTimerRef.current);
      }
    }, speed);
  }, []);

  // Переключение сцен и таймингов
  useEffect(() => {
    if (!isStarted) return;

    if (sceneIndex >= SCENES.length) {
      handleFinish();
      return;
    }

    const currentScene = SCENES[sceneIndex];
    setFadeState('fadeIn');

    // Проигрывание звука сцены
    if (currentScene.sound) {
      sfx.play(currentScene.sound, 0.7);
    }

    // Запуск тайпинга для соответствующих сцен
    if (currentScene.motionType.toLowerCase().includes('type')) {
      runTypewriter(currentScene.title, 60);
    } else {
      setTypedTitle(currentScene.title);
    }

    // Уход в фейдаут перед сменой
    const fadeOutTimer = setTimeout(() => {
      setFadeState('fadeOut');
    }, currentScene.duration - 600);

    // Переключение на следующую сцену
    const nextTimer = setTimeout(() => {
      setSceneIndex((prev) => prev + 1);
    }, currentScene.duration);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(nextTimer);
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [isStarted, sceneIndex, handleFinish, runTypewriter]);

  // Горячие клавиши (Space / Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Escape') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFinish]);

  const currentScene = SCENES[sceneIndex];

  return (
    <div className={styles.introContainer}>
      {/* 1. 3D сцена на заднем плане */}
      <Intro3DScene mode={currentScene ? currentScene.id : 'studio'} />

      {/* 2. Кинотеатральный оверлей и кинорамки */}
      <div className={styles.letterboxTop} />
      <div className={styles.letterboxBottom} />
      <div className={styles.scanlines} />
      <div className={styles.vignette} />

      {/* 3. Стартовый шлюз (до нажатия) */}
      {!isStarted ? (
        <div className={styles.startPortal}>
          <div className={styles.portalBadge}>
            <span className={styles.pulseDot} /> ALBARS CORE // SECURE PROTOCOL
          </div>
          <h1 className={styles.portalTitle}>СИМУЛЯЦИЯ РЕАЛЬНОСТИ</h1>
          <p className={styles.portalSubtitle}>Нажмите для синхронизации аудиовизуального ядра</p>

          <button className={styles.portalButton} onClick={handleStart}>
            <span className={styles.buttonGlow} />
            <span className={styles.buttonText}>ВОЙТИ В СИСТЕМУ</span>
            <div className={styles.buttonLaserSweep} />
          </button>
        </div>
      ) : (
        /* 4. Рендер активной сцены */
        currentScene && (
          <div className={`${styles.sceneWrapper} ${styles[fadeState]} ${styles[currentScene.motionType]}`}>
            {currentScene.badge && (
              <div className={styles.sceneBadge}>
                <span className={styles.badgeLine} />
                {currentScene.badge}
                <span className={styles.badgeLine} />
              </div>
            )}

            <h2 className={styles.sceneTitle}>
              {currentScene.motionType.toLowerCase().includes('type') ? typedTitle : currentScene.title}
              {currentScene.motionType.toLowerCase().includes('type') && <span className={styles.cursor}>_</span>}
            </h2>

            {currentScene.subtitle && (
              <p className={styles.sceneSubtitle}>{currentScene.subtitle}</p>
            )}
          </div>
        )
      )}

      {/* 5. Ненавязчивая геймерская кнопка пропуска (правый нижний угол) */}
      <div className={styles.skipBox}>
        <button className={styles.skipBtn} onClick={handleFinish}>
          <span className={styles.skipKey}>[ ESC / ПРОБЕЛ ]</span>
          <span className={styles.skipText}>ПРОПУСТИТЬ</span>
          <span className={styles.skipArrow}>▸▸</span>
        </button>
      </div>

      {/* 6. Оранжевый прогресс-бар внизу экрана */}
      {isStarted && (
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((sceneIndex + 1) / SCENES.length) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
