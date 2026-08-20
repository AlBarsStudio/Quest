import { useState, useRef, useEffect } from 'react';
import styles from './Level5Final.module.css';

export default function Level5Final({ onNext, onSkip }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokePoints, setStrokePoints] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isOverload, setIsOverload] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Адаптивное масштабирование Canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#f43f5e';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#f43f5e';
  }, []);

  const startDrawing = (e) => {
    if (isScanning || isOverload) return;
    setIsDrawing(true);
    const pos = getPos(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setStrokePoints(prev => [...prev, pos]);
  };

  const draw = (e) => {
    if (!isDrawing || isScanning || isOverload) return;
    const pos = getPos(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setStrokePoints(prev => [...prev, pos]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const clearCanvas = () => {
    if (isScanning || isOverload) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokePoints([]);
  };

  const handleVerifyBiometrics = () => {
    if (strokePoints.length < 15) return;
    setIsScanning(true);

    let current = 0;
    const timer = setInterval(() => {
      current += 4;
      setScanProgress(Math.min(current, 99));

      if (current >= 100) {
        clearInterval(timer);
        setIsOverload(true);
        setTimeout(() => {
          onNext();
        }, 3200);
      }
    }, 60);
  };

  return (
    <div className={styles.levelWrapper}>
      <button className={styles.skipBtn} onClick={onSkip}>
        ПРОПУСТИТЬ УРОВЕНЬ ⏭
      </button>

      {!isOverload ? (
        <div className={styles.biometricModal}>
          <div className={styles.modalHeader}>
            <div className={styles.badgeStage}>HeartOS Security // Stage 5 of 5</div>
            <h2 className={styles.title}>Биометрическая калибровка чувств</h2>
            <p className={styles.subtitle}>
              Нарисуйте пальцем или мышью сердце на сенсорной панели для финальной калибровки.
            </p>
          </div>

          <div className={styles.canvasContainer}>
            <canvas 
              ref={canvasRef}
              className={styles.paintCanvas}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            {strokePoints.length === 0 && (
              <div className={styles.canvasPlaceholder}>
                <span>❤️ Нарисуйте контур сердца здесь</span>
              </div>
            )}
            {isScanning && <div className={styles.laserScanLine}></div>}
          </div>

          <div className={styles.controlButtons}>
            <button 
              className={styles.clearBtn} 
              onClick={clearCanvas}
              disabled={isScanning || strokePoints.length === 0}
            >
              Стереть
            </button>

            <button 
              className={styles.submitBtn} 
              onClick={handleVerifyBiometrics}
              disabled={isScanning || strokePoints.length < 15}
            >
              {isScanning ? `СКАНИРОВАНИЕ... ${scanProgress}%` : 'ВЕРИФИЦИРОВАТЬ РИСУНОК'}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.overloadContainer}>
          <div className={styles.glitchHeart}>❤️</div>
          <h1 className={styles.overloadTitle}>КРИТИЧЕСКИЙ ПЕРЕГРЕВ ЭМОЦИЙ</h1>
          <p className={styles.overloadDesc}>
            &gt; СОВПАДЕНИЕ БИОМЕТРИИ: 100%<br/>
            &gt; АССИСТЕНТ: "Логические фильтры расплавлены. Защита пала."<br/>
            &gt; ПЕРЕНАПРАВЛЕНИЕ В СЕКТОР НЕЙРОННОЙ СИНХРОНИЗАЦИИ...
          </p>
        </div>
      )}
    </div>
  );
}
