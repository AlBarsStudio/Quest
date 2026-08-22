import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Intro.module.css';
import { sfx } from './soundEffects';

const SCENES = [
  {
    id: 'studio',
    primary: "AlBars Studio",
    secondary: "ПРЕДСТАВЛЯЕТ",
    duration: 4500,
    bgMode: 'laser',
    sound: () => { sfx.playSubDrop(); setTimeout(() => sfx.playLaser(), 400); }
  },
  {
    id: 'ai-core',
    primary: "Вычислительная архитектура",
    secondary: "GEMINI AI CORE ARCHITECTURE",
    duration: 4200,
    bgMode: 'grid',
    sound: () => { sfx.playGlitch(); }
  },
  {
    id: 'creation',
    primary: "Цифровые миры не рождаются из пустоты.",
    secondary: "Они обретают форму там, где реальности больше недостаточно.",
    duration: 5500,
    bgMode: 'tunnel',
    sound: () => { sfx.playRiser(5.0); }
  },
  {
    id: 'process',
    primary: "Сотни бессонных часов. Миллионы строк кода.",
    secondary: "Сложная архитектура, застывшая в ожидании единственного триггера.",
    duration: 5200,
    bgMode: 'vortex',
    sound: () => { sfx.playSubDrop(); }
  },
  {
    id: 'gravity',
    primary: "Но совершенный алгоритм бессилен без истинной цели.",
    secondary: "Эта система подчинена лишь одному фундаментальному закону гравитации.",
    duration: 5200,
    bgMode: 'singularity',
    sound: () => { sfx.playRiser(4.5); }
  },
  {
    id: 'the-one',
    primary: "Единственный человек, ради которого существует эта вселенная:",
    secondary: "",
    duration: 4200,
    bgMode: 'freeze',
    sound: () => {}
  },
  {
    id: 'heroine',
    primary: "А Н А С Т А С И Я",
    secondary: "ID: SYS-2004-04-20 // BIOMETRIC_MATCH: 100%",
    duration: 6000,
    bgMode: 'supernova',
    sound: () => { sfx.playBraam(); }
  },
  {
    id: 'access',
    primary: "[ ROOT PRIVILEGES ASSIGNED ]",
    secondary: "Матрица синхронизирована. Все уровни допуска сняты.",
    duration: 4200,
    bgMode: 'hud-lock',
    sound: () => { sfx.playAccessGranted(); }
  },
  {
    id: 'launch',
    primary: "ДОБРО ПОЖАЛОВАТЬ В ЯДРО",
    secondary: "Инициализация пространственной сетки...",
    duration: 2500,
    bgMode: 'warp',
    sound: () => { sfx.playGlitch(); sfx.playSubDrop(); }
  }
];

export default function Intro({ onComplete }) {
  const [isStarted, setIsStarted] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [fadeState, setFadeState] = useState('in'); // 'in' | 'out'
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);

  // Завершение интро с сохранением в localStorage
  const handleFinish = useCallback(() => {
    try {
      localStorage.setItem('albars_quest_intro_completed', 'true');
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    onComplete();
  }, [onComplete]);

  // Запуск симуляции
  const handleStart = () => {
    sfx.init();
    setIsStarted(true);
    if (SCENES[0].sound) SCENES[0].sound();
  };

  // Переключение сцен
  useEffect(() => {
    if (!isStarted) return;

    if (sceneIndex >= SCENES.length) {
      handleFinish();
      return;
    }

    setFadeState('in');
    const currentScene = SCENES[sceneIndex];
    if (currentScene.sound) currentScene.sound();

    // Запуск ухода в фейд перед сменой сцены
    const fadeTimer = setTimeout(() => {
      setFadeState('out');
    }, currentScene.duration - 600);

    const nextSceneTimer = setTimeout(() => {
      setSceneIndex((prev) => prev + 1);
    }, currentScene.duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(nextSceneTimer);
    };
  }, [isStarted, sceneIndex, handleFinish]);

  // Горячие клавиши (Space / Esc для пропуска)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Escape') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFinish]);

  // ==========================================
  // ГЕНЕРАТИВНЫЙ CANVAS МОУШЕН-ДВИЖОК
  // ==========================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    // Инициализация частиц
    const initParticles = () => {
      const p = [];
      const count = 350;
      for (let i = 0; i < count; i++) {
        p.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 1000,
          baseX: Math.random() * width,
          baseY: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 2 + 0.5,
          color: Math.random() > 0.3 ? '#4ade80' : '#ffffff',
          alpha: Math.random() * 0.6 + 0.2
        });
      }
      particlesRef.current = p;
    };
    initParticles();

    let angle = 0;
    let shockwaveRadius = 0;

    const render = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.25)';
      ctx.fillRect(0, 0, width, height);

      const mode = isStarted && SCENES[sceneIndex] ? SCENES[sceneIndex].bgMode : 'laser';
      const cx = width / 2;
      const cy = height / 2;
      const particles = particlesRef.current;

      angle += 0.015;

      // 1. Режим: Лазерная линия
      if (mode === 'laser') {
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(width, cy);
        ctx.stroke();

        ctx.strokeStyle = '#4ade80';
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(cx - 150, cy);
        ctx.lineTo(cx + 150, cy);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // 2. Режим: Координатная сетка
      else if (mode === 'grid') {
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.07)';
        ctx.lineWidth = 1;
        const gridSize = 60;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // 3. Режим: 3D Туннель
      else if (mode === 'tunnel') {
        particles.forEach((p) => {
          p.z -= 4;
          if (p.z <= 0) p.z = 1000;
          const k = 300 / p.z;
          const px = (p.x - cx) * k + cx;
          const py = (p.y - cy) * k + cy;
          const sz = Math.max(0.5, p.size * k);

          if (px >= 0 && px <= width && py >= 0 && py <= height) {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.min(1, (1000 - p.z) / 800);
            ctx.beginPath();
            ctx.arc(px, py, sz, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.globalAlpha = 1;
      }

      // 4. Режим: Спиральный вихрь
      else if (mode === 'vortex') {
        particles.forEach((p, idx) => {
          const dist = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2);
          const a = Math.atan2(p.y - cy, p.x - cx) + 0.025;
          const speed = (1000 - dist) * 0.001 + 0.5;
          p.x = cx + Math.cos(a) * (dist - speed);
          p.y = cy + Math.sin(a) * (dist - speed);

          if (dist < 20) {
            p.x = cx + (Math.random() - 0.5) * width;
            p.y = cy + (Math.random() - 0.5) * height;
          }

          ctx.fillStyle = idx % 2 === 0 ? '#4ade80' : '#388bfd';
          ctx.globalAlpha = p.alpha;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        });
        ctx.globalAlpha = 1;
      }

      // 5. Режим: Сингулярность
      else if (mode === 'singularity') {
        particles.forEach((p) => {
          p.x += (cx - p.x) * 0.04;
          p.y += (cy - p.y) * 0.04;
          ctx.fillStyle = '#4ade80';
          ctx.fillRect(p.x, p.y, p.size, p.size);
        });
        ctx.beginPath();
        ctx.arc(cx, cy, 25 + Math.sin(angle * 4) * 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(74, 222, 128, 0.4)';
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur = 30;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 6. Режим: Замирание перед взрывом
      else if (mode === 'freeze') {
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
        shockwaveRadius = 0;
      }

      // 7. Режим: Сверхновая
      else if (mode === 'supernova') {
        shockwaveRadius += 18;
        if (shockwaveRadius < width * 1.5) {
          ctx.strokeStyle = `rgba(74, 222, 128, ${Math.max(0, 1 - shockwaveRadius / (width * 1.2))})`;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(cx, cy, shockwaveRadius, 0, Math.PI * 2);
          ctx.stroke();
        }

        particles.forEach((p) => {
          const dx = p.x - cx;
          const dy = p.y - cy;
          p.x += dx * 0.08;
          p.y += dy * 0.08;

          ctx.fillStyle = '#4ade80';
          ctx.shadowColor = '#4ade80';
          ctx.shadowBlur = 10;
          ctx.fillRect(p.x, p.y, p.size * 2, p.size * 2);
          ctx.shadowBlur = 0;
        });
      }

      // 8. Режим: HUD Lock
      else if (mode === 'hud-lock') {
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - 250, cy - 100, 500, 200);

        ctx.strokeStyle = '#4ade80';
        ctx.strokeRect(cx - 260, cy - 110, 20, 20);
        ctx.strokeRect(cx + 240, cy + 90, 20, 20);
      }

      // 9. Режим: Гиперпрыжок (Warp)
      else if (mode === 'warp') {
        particles.forEach((p) => {
          p.z -= 30;
          if (p.z <= 0) p.z = 1000;
          const k = 400 / p.z;
          const px = (p.x - cx) * k + cx;
          const py = (p.y - cy) * k + cy;

          ctx.strokeStyle = '#4ade80';
          ctx.lineWidth = Math.max(1, p.size * k);
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo((p.x - cx) * (k * 1.15) + cx, (p.y - cy) * (k * 1.15) + cy);
          ctx.stroke();
        });
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isStarted, sceneIndex]);

  const currentSceneData = SCENES[sceneIndex];

  return (
    <div className={styles.cinemaContainer}>
      {/* 1. Кино-холст моушен-графики */}
      <canvas ref={canvasRef} className={styles.canvasBackground} />

      {/* 2. Кинематографические рамки 21:9 Letterbox */}
      <div className={styles.letterboxTop} />
      <div className={styles.letterboxBottom} />

      {/* 3. CRT Scanline & Grain FX */}
      <div className={styles.scanlineOverlay} />

      {/* 4. Стартовый шлюз */}
      {!isStarted ? (
        <div className={styles.gateWrapper}>
          <div className={styles.gateSystemBadge}>
            <span className={styles.liveDot} /> SECURE PROTOCOL // ALBARS_2026
          </div>
          <h1 className={styles.gateTitle}>ВХОД В СИМУЛЯЦИЮ</h1>
          <p className={styles.gateSubtitle}>Требуется прямое подтверждение ядра</p>

          <button className={styles.initiateButton} onClick={handleStart}>
            <span className={styles.buttonGlitchLayer}></span>
            <span className={styles.buttonText}>ИНИЦИАЛИЗИРОВАТЬ СИСТЕМУ</span>
            <div className={styles.buttonScanner}></div>
          </button>
        </div>
      ) : (
        /* 5. Активная сцена титров */
        currentSceneData && (
          <div
            key={currentSceneData.id}
            className={`${styles.sceneContent} ${styles[fadeState]} ${
              currentSceneData.id === 'heroine' ? styles.heroineScene : ''
            }`}
          >
            {currentSceneData.id === 'heroine' ? (
              <div className={styles.heroineWrapper}>
                <div className={styles.heroinePreTitle}>ЦЕЛЬ СИНХРОНИЗАЦИИ ОПРЕДЕЛЕНА</div>
                <h1 className={styles.heroineName}>{currentSceneData.primary}</h1>
                <div className={styles.heroinePostTitle}>{currentSceneData.secondary}</div>
              </div>
            ) : (
              <div className={styles.standardSceneWrapper}>
                <h2 className={styles.primaryText}>{currentSceneData.primary}</h2>
                {currentSceneData.secondary && (
                  <p className={styles.secondaryText}>{currentSceneData.secondary}</p>
                )}
              </div>
            )}
          </div>
        )
      )}

      {/* 6. Геймерская кнопка пропуска (правый нижний угол) */}
      <div className={styles.skipContainer}>
        <button className={styles.skipButton} onClick={handleFinish}>
          <span className={styles.skipKeyHint}>[ ESC / ПРОБЕЛ ]</span>
          <span className={styles.skipLabel}>ПРОПУСТИТЬ</span>
          <span className={styles.skipArrows}>▸▸</span>
        </button>
      </div>

      {/* 7. Тонкий прогресс-бар снизу */}
      {isStarted && (
        <div className={styles.timelineBar}>
          <div
            className={styles.timelineFill}
            style={{
              width: `${((sceneIndex + 1) / SCENES.length) * 100}%`
            }}
          />
        </div>
      )}
    </div>
  );
    }
      
