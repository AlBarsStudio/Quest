import { useState, useEffect } from 'react';
import styles from './FinalQuest.module.css';

export default function FinalQuestFlow({ onReturnToDashboard }) {
  const [phase, setPhase] = useState('step1_oven'); // step1_oven, step2_radar, hacking, magic
  const [key1, setKey1] = useState('');
  const [key2, setKey2] = useState('');
  const [error, setError] = useState(false);
  const [glitchText, setGlitchText] = useState('ДЕДЕКОДИНГ...');

  // Ключи дешифровки (можно поменять)
  const VALID_KEY_1 = 'LUPIN-3';
  const VALID_KEY_2 = 'DRACO-6';

  // Обработчик первого этапа (Духовка)
  const handleVerifyKey1 = () => {
    if (key1.trim().toUpperCase() === VALID_KEY_1) {
      setError(false);
      setPhase('step2_radar');
    } else {
      triggerError();
    }
  };

  // Обработчик второго этапа (Возвращение с улицы)
  const handleVerifyKey2 = () => {
    if (key2.trim().toUpperCase() === VALID_KEY_2) {
      setError(false);
      startHackSequence();
    } else {
      triggerError();
    }
  };

  const triggerError = () => {
    setError(true);
    setTimeout(() => setError(false), 2000);
  };

  // Эффект взлома и переход к магии
  const startHackSequence = () => {
    setPhase('hacking');
    let iterations = 0;
    const interval = setInterval(() => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
      let randomStr = '';
      for(let i=0; i<12; i++) randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
      setGlitchText(randomStr);
      iterations++;
      
      if (iterations > 20) {
        clearInterval(interval);
        setGlitchText('МАГИЧЕСКАЯ СИГНАТУРА НАЙДЕНА');
        setTimeout(() => setPhase('magic'), 2000);
      }
    }, 100);
  };

  return (
    <div className={styles.container}>
      
      {/* =========================================
          ФАЗА 1: ЗАГАДКА ПРО ДУХОВКУ
      ========================================= */}
      {phase === 'step1_oven' && (
        <div className={styles.authWrapper}>
          <div className={styles.scanline}></div>
          <h1 className={styles.title}>БЛОКИРОВКА ЯДРА</h1>
          <div className={styles.questLog}>
            <p className={styles.highlightText}>SYS.MSG: Финальный протокол зашифрован.</p>
            <p>В моем металлическом сердце рождается жар, но сейчас внутри темно и холодно. Открой дверцу того, что способно согреть, но само не чувствует тепла, чтобы найти первый фрагмент истины.</p>
          </div>
          
          <div className={styles.inputBox}>
            <label>ФРАГМЕНТ [АЛЬФА]</label>
            <input 
              type="text" 
              value={key1} 
              onChange={(e) => setKey1(e.target.value)}
              placeholder="Введите найденный код..." 
              className={error ? styles.errorInput : ''}
            />
          </div>

          {error && <div className={styles.errorMessage}>ОШИБКА: ДОСТУП ОТКЛОНЕН</div>}

          <button className={styles.verifyBtn} onClick={handleVerifyKey1}>
            [ ПОДТВЕРДИТЬ КОД ]
          </button>
          
          <button className={styles.backBtn} onClick={onReturnToDashboard}>
            Вернуться в систему
          </button>
        </div>
      )}

      {/* =========================================
          ФАЗА 2: АКТИВАЦИЯ РАДАРА И ВТОРОЙ КОД
      ========================================= */}
      {phase === 'step2_radar' && (
        <div className={styles.authWrapper}>
          <div className={styles.scanline}></div>
          <h1 className={styles.title}>СИНХРОНИЗАЦИЯ...</h1>
          
          <div className={styles.successBlock}>
            <span>✓ ФРАГМЕНТ АЛЬФА ИНТЕГРИРОВАН</span>
          </div>

          <div className={styles.questLog}>
            <p>Следующий ключ ждет там, где зажглась наша первая искра под открытым небом. Связь на месте будет потеряна.</p>
            <p className={styles.warningText}>ВНИМАНИЕ: Загрузите модуль пространственного поиска на мобильное устройство, пока активно Wi-Fi соединение.</p>
          </div>

          {/* Здесь можешь вставить реальный QR-код картинкой или ссылку */}
          <div className={styles.radarLinkBox}>
            <div className={styles.qrPlaceholder}>
              [ЗДЕСЬ БУДЕТ QR КОД ИЛИ КНОПКА ССЫЛКИ НА РАДАР]
            </div>
            <p className={styles.smallText}>Отсканируй телефоном и не закрывай вкладку радара в пути.</p>
          </div>
          
          <div className={styles.inputBox}>
            <label>ФРАГМЕНТ [ОМЕГА] (Ввести по возвращении)</label>
            <input 
              type="text" 
              value={key2} 
              onChange={(e) => setKey2(e.target.value)}
              placeholder="Код со второй точки..."
              className={error ? styles.errorInput : ''}
            />
          </div>

          {error && <div className={styles.errorMessage}>ОШИБКА: НЕСОВПАДЕНИЕ СИГНАТУР</div>}

          <button className={styles.verifyBtn} onClick={handleVerifyKey2}>
            [ ИНИЦИАЛИЗИРОВАТЬ СЛИЯНИЕ ]
          </button>
        </div>
      )}

      {/* =========================================
          ФАЗА 3: ГЛИТЧ-ВЗЛОМ
      ========================================= */}
      {phase === 'hacking' && (
        <div className={styles.glitchWrapper}>
          <h2 className={styles.glitchText} data-text={glitchText}>
            {glitchText}
          </h2>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
        </div>
      )}

      {/* =========================================
          ФАЗА 4: МАГИЧЕСКИЙ ФИНАЛ
      ========================================= */}
      {phase === 'magic' && (
        <div className={styles.magicWrapper}>
          <div className={styles.stars1}></div>
          <div className={styles.stars2}></div>
          <div className={styles.stars3}></div>
          
          <div className={styles.magicContent}>
            <div className={styles.revealDelay1}>
              <h1 className={styles.magicTitle}>Шалость удалась</h1>
              <div className={styles.divider}></div>
            </div>
            
            <p className={styles.magicTextDelay2}>
              Перед тобой истории двух совершенно разных магических сосудов из Хогвартса.
            </p>
            <p className={styles.magicTextDelay3}>
              В одном прятался страх на уроке профессора Люпина, ожидая заклинания <i>Риддикулус</i>.
            </p>
            <p className={styles.magicTextDelay4}>
              Другой — Драко Малфой чинил целый год, чтобы создать тайный портал.
            </p>
            
            <div className={styles.magicTextDelay5}>
              <p className={styles.goldHighlight}>
                В мире волшебников они обладают разной магией, <br/>
                но в нашем мире это один и тот же предмет мебели.
              </p>
              <p className={styles.finalQuestion}>
                Что их объединяет?
              </p>
              <p className={styles.actionText}>
                Именно там, за его закрытыми дверцами, скрыта твоя награда.<br/>
                Ищи!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
