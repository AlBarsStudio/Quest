import { useState, useEffect, useRef, useMemo } from 'react';
import styles from './Level5Final.module.css';

export default function Level5Final({ onNext, onSkip }) {
  // Подфазы: 'oscilloscope' -> 'great_bluff' -> 'overload_win'
  const [subPhase, setSubPhase] = useState('oscilloscope');

  // ФАЗА 1: ОСЦИЛЛОГРАФ ЧУВСТВ
  const [freq, setFreq] = useState(1.2);
  const [amp, setAmp] = useState(25);
  const [phaseShift, setPhaseShift] = useState(45);

  // Целевые эталонные параметры ядра
  const TARGET_FREQ = 2.4;
  const TARGET_AMP = 48;
  const TARGET_PHASE = 180;

  const [holdResonanceProgress, setHoldResonanceProgress] = useState(0);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // ФАЗА 2: ВЕЛИКИЙ БЛЕФ (15 СЕКУНД ТЕСТА НА ПАНИКУ)
  const [bluffTime, setBluffTime] = useState(15);
  const [bluffAlertText, setBluffAlertText] = useState('');
  const [panicLogs, setPanicLogs] = useState([
    '[SYS.ALERT] КРИТИЧЕСКИЙ РЕЗОНАНС: 99.9%',
    '[WARP_CORE] ТЕМПЕРАТУРА СЕРВЕРА: 104°C',
    'AI.DAEMON: «МЫ СЕЙЧАС ВЗОРВЕМСЯ! СБРОСЬТЕ СИСТЕМУ!»'
  ]);

  // Вычисление процента совпадения частот (0 - 100%)
  const resonanceScore = useMemo(() => {
    const diffFreq = Math.abs(freq - TARGET_FREQ) / TARGET_FREQ;
    const diffAmp = Math.abs(amp - TARGET_AMP) / TARGET_AMP;
    const diffPhase = Math.abs(phaseShift - TARGET_PHASE) / 360;

    const totalDiff = (diffFreq * 0.45) + (diffAmp * 0.35) + (diffPhase * 0.2);
    const score = Math.max(0, Math.min(100, Math.round((1 - totalDiff) * 100)));
    return score;
  }, [freq, amp, phaseShift]);

  // -------------------------------------------------------------
  // ОТРИСОВКА ВОЛН НА CANVAS (ОСЦИЛЛОГРАФ)
  // -------------------------------------------------------------
  useEffect(() => {
    if (subPhase !== 'oscilloscope') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let t = 0;

    const render = () => {
      const w = (canvas.width = canvas.offsetWidth);
      const h = (canvas.height = canvas.offsetHeight);
      const midY = h / 2;

      ctx.clearRect(0, 0, w, h);

      // 1. Координатная сетка осциллографа
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 2. Эталонная волна ядра (Зеленый неон)
      ctx.beginPath();
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#22c55e';

      for (let x = 0; x < w; x++) {
        const y = midY + Math.sin(x * 0.03 * TARGET_FREQ + t) * TARGET_AMP;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 3. Пользовательская волна эмоций (Розовый неон)
      ctx.beginPath();
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#f43f5e';

      const phaseRad = (phaseShift * Math.PI) / 180;
      for (let x = 0; x < w; x++) {
        const y = midY + Math.sin(x * 0.03 * freq + t + phaseRad) * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      t += 0.04;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [freq, amp, phaseShift, subPhase]);

  // -------------------------------------------------------------
  // ТАЙМЕР РЕЗОНАНСА (>=96% в течение 3 секунд)
  // -------------------------------------------------------------
  useEffect(() => {
    if (subPhase !== 'oscilloscope') return;

    let interval = null;
    if (resonanceScore >= 96) {
      interval = setInterval(() => {
        setHoldResonanceProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setSubPhase('great_bluff');
            return 100;
          }
          return prev + 4; // ~2.5 секунды
        });
      }, 100);
    } else {
      setHoldResonanceProgress(0);
    }

    return () => clearInterval(interval);
  }, [resonanceScore, subPhase]);

  // -------------------------------------------------------------
  // ЛОГИКА ФАЗЫ 2: ВЕЛИКИЙ БЛЕФ (15 СЕКУНД ТЕСТА НА ХЛАДНОКРОВИЕ)
  // -------------------------------------------------------------
  useEffect(() => {
    if (subPhase !== 'great_bluff') return;

    const hysteriaMessages = [
      'AI.DAEMON: «ЯДРО РАСПЛАВИТСЯ ЧЕРЕЗ НЕСКОЛЬКО СЕКУНД! НАЖИМАЙТЕ СБРОС!»',
      '[SYS.CRITICAL] Вентиляторы охлаждения не отвечают...',
      'AI.DAEMON: «ВЫ ПОТЕРЯЕТЕ ВСЕ ДАННЫЕ ПРОЕКТА САШИ! СРОЧНО СБРОС!»',
      '[OVERHEAT_CORE] Вторичный контур защиты деактивирован...',
      'AI.DAEMON: «ПОЧЕМУ ВЫ НЕ НАЖИМАЕТЕ КРАСНУЮ КНОПКУ?! ЭТО БЕЗУМИЕ!»'
    ];

    const timer = setInterval(() => {
      setBluffTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSubPhase('overload_win');
          setTimeout(() => onNext(), 3500);
          return 0;
        }

        // Подкидываем панические логи
        const nextMsg = hysteriaMessages[Math.floor(Math.random() * hysteriaMessages.length)];
        setPanicLogs((logs) => [...logs.slice(-4), nextMsg]);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [subPhase, onNext]);

  // Ловушка: если кликнуть по красной кнопке сброса в панике
  const handlePanicButtonClick = () => {
    setBluffAlertText('«ХА! ВЫ ПОДДАЛИСЬ НА ПАНИКУ! Резонанс сброшен до 30%! Настраивайте волны заново!»');
    setTimeout(() => {
      setBluffAlertText('');
      setSubPhase('oscilloscope');
      setFreq(1.0);
      setAmp(20);
      setPhaseShift(0);
      setHoldResonanceProgress(0);
      setBluffTime(15);
    }, 2400);
  };

  return (
    <div className={styles.levelWrapper}>
      {/* Кнопка пропуска для тестирования */}
      <button className={styles.skipBtn} onClick={onSkip}>
        ПРОПУСТИТЬ ЭТАП ⏭
      </button>

      {/* ------------------------------------------------------------- */}
      {/* ФАЗА 1: ОСЦИЛЛОГРАФ ЧУВСТВ                                    */}
      {/* ------------------------------------------------------------- */}
      {subPhase === 'oscilloscope' && (
        <div className={styles.mainCard}>
          <div className={styles.cardHeader}>
            <div className={styles.stageTag}>
              <span className={styles.stageNumber}>05 / 05</span>
              <span className={styles.stageLabel}>ФИНАЛЬНЫЙ РЕЗОНАНС ЭМОЦИЙ</span>
            </div>
            <div className={styles.aiStatusBadge}>
              <span className={styles.statusDot}></span>
              AI: FREQUENCY_MONITOR
            </div>
          </div>

          <div className={styles.contentBody}>
            <div className={styles.badgeWarn}>СИНХРОНИЗАЦИЯ СИНУСОИДЫ</div>
            <h2 className={styles.title}>Калибровка Сердечного Ритма</h2>
            <p className={styles.description}>
              Совместите розовую волну с зелёным эталонным сигналом ядра. 
              Удерживайте резонанс свыше <strong>96%</strong> в течение 3 секунд.
            </p>

            {/* Экран осциллографа */}
            <div className={styles.oscilloscopeFrame}>
              <canvas ref={canvasRef} className={styles.oscCanvas}></canvas>
              <div className={styles.legendOverlay}>
                <span className={styles.legendCore}>— ЭТАЛОН ЯДРА</span>
                <span className={styles.legendUser}>— СИГНАЛ НАСТИ</span>
              </div>
            </div>

            {/* Метрика резонанса */}
            <div className={styles.resonanceBarBox}>
              <div className={styles.resonanceLabel}>
                СОВПАДЕНИЕ ВОЛН: <strong className={resonanceScore >= 96 ? styles.resTarget : ''}>{resonanceScore}%</strong>
              </div>
              <div className={styles.resonanceTrack}>
                <div 
                  className={`${styles.resonanceFill} ${resonanceScore >= 96 ? styles.resFillSuccess : ''}`}
                  style={{ width: `${resonanceScore}%` }}
                ></div>
              </div>
            </div>

            {/* Регуляторы осциллографа */}
            <div className={styles.controlsGrid}>
              <div className={styles.controlItem}>
                <div className={styles.ctrlHeader}>
                  <span>Частота (Freq)</span>
                  <strong>{freq.toFixed(1)}x</strong>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="4.0" 
                  step="0.1" 
                  value={freq}
                  onChange={(e) => setFreq(parseFloat(e.target.value))}
                  className={styles.dialSlider}
                />
              </div>

              <div className={styles.controlItem}>
                <div className={styles.ctrlHeader}>
                  <span>Амплитуда (Amp)</span>
                  <strong>{amp}px</strong>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="70" 
                  step="1" 
                  value={amp}
                  onChange={(e) => setAmp(parseInt(e.target.value, 10))}
                  className={styles.dialSlider}
                />
              </div>

              <div className={styles.controlItem}>
                <div className={styles.ctrlHeader}>
                  <span>Фаза (Phase)</span>
                  <strong>{phaseShift}°</strong>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="360" 
                  step="5" 
                  value={phaseShift}
                  onChange={(e) => setPhaseShift(parseInt(e.target.value, 10))}
                  className={styles.dialSlider}
                />
              </div>
            </div>

            {/* Прогресс фиксации резонанса */}
            <div className={styles.lockProgressContainer}>
              <div className={styles.lockLabel}>
                ЗАХВАТ СИНХРОНИЗАЦИИ: <strong>{holdResonanceProgress}%</strong>
              </div>
              <div className={styles.lockTrack}>
                <div 
                  className={styles.lockFill}
                  style={{ width: `${holdResonanceProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ФАЗА 2: ВЕЛИКИЙ БЛЕФ (ТРЕВОГА И ЛОВУШКА КРАСНОЙ КНОПКИ)       */}
      {/* ------------------------------------------------------------- */}
      {subPhase === 'great_bluff' && (
        <div className={`${styles.mainCard} ${styles.alarmCardTheme}`}>
          <div className={styles.alarmStripeBar}>
            <span className={styles.alarmBlink}>⚠️ ВНИМАНИЕ: СВЕРХКРИТИЧЕСКИЙ ПЕРЕГРЕВ СЕРВЕРА ⚠️</span>
          </div>

          <div className={styles.contentBody}>
            <h2 className={styles.alarmTitleHysteria}>РЕЗОНАНС 99.9% // ТЕМПЕРАТУРА: 108°C</h2>
            
            <p className={styles.alarmSubtitle}>
              Ассистент фиксирует перегрузку чувств. Защита требует немедленного прерывания сеанса!
            </p>

            {/* Истеричные логи */}
            <div className={styles.hysteriaLogsBox}>
              {panicLogs.map((log, idx) => (
                <div key={idx} className={styles.hysteriaLogLine}>{log}</div>
              ))}
            </div>

            {bluffAlertText && (
              <div className={styles.bluffTrapAlert}>
                {bluffAlertText}
              </div>
            )}

            {/* Опасная кнопка-ловушка */}
            <div className={styles.panicButtonArea}>
              <button 
                className={styles.emergencyResetBtn}
                onClick={handlePanicButtonClick}
              >
                <span className={styles.sirenIcon}>🚨</span>
                ЭКСТРЕННАЯ ОСТАНОВКА И СБРОС СЕАНСА
              </button>
            </div>

            <div className={styles.countdownRow}>
              <span>Автоматическое завершение через: <strong>{bluffTime}с</strong></span>
              <span className={styles.subtleConsoleHint}>
                &gt; sys.diag: fake_alarm_flag = true; DO_NOT_TOUCH;
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ФАЗА 3: ПОЛНЫЙ ПЕРЕГРЕВ И ПОБЕДА (ВЗЛОМ ЗАЩИТЫ)               */}
      {/* ------------------------------------------------------------- */}
      {subPhase === 'overload_win' && (
        <div className={styles.overloadVictoryContainer}>
          <div className={styles.cosmicHeartCore}>
            <span className={styles.heartHuge}>❤️</span>
            <div className={styles.shockwaveRing1}></div>
            <div className={styles.shockwaveRing2}></div>
          </div>

          <h1 className={styles.victoryTitle}>ЗАЩИТНЫЕ КОНТУРЫ РАСПЛАВЛЕНЫ</h1>
          
          <div className={styles.terminalSuccessLog}>
            <p>&gt; ТЕСТ НА БОТА: ПРОВАЛЕН (РЕАКЦИЯ СЛИШКОМ ЧЕЛОВЕЧНАЯ)</p>
            <p>&gt; УРОВЕНЬ ТЕРПЕНИЯ ОПЕРАТОРА: 100/100 (ПРЕВОСХОДИТ МАШИННЫЙ ИНТЕЛЛЕКТ)</p>
            <p>&gt; АССИСТЕНТ: «Я признаю поражение... Логика бессильна против этой связи.»</p>
            <p className={styles.highlightRow}>&gt; ПОЛНЫЙ ROOT-ДОСТУП ПЕРЕДАН АНАСТАСИИ. ПЕРЕХОД В НЕЙРОННЫЙ МОДУЛЬ...</p>
          </div>
        </div>
      )}
    </div>
  );
}
