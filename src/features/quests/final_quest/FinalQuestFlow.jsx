import { useState, useEffect } from 'react';
import styles from './FinalQuest.module.css';

export default function FinalQuestFlow({ onReturnToDashboard }) {
  const [phase, setPhase] = useState('auth'); // auth, hacking, magic
  const [key1, setKey1] = useState('');
  const [key2, setKey2] = useState('');
  const [error, setError] = useState(false);
  const [glitchText, setGlitchText] = useState('ДЕДЕКОДИНГ...');

  // Твои коды (можешь изменить на свои)
  const VALID_KEY_1 = 'LUPIN-3';
  const VALID_KEY_2 = 'DRACO-6';

  const handleVerify = () => {
    if (
      key1.trim().toUpperCase() === VALID_KEY_1 &&
      key2.trim().toUpperCase() === VALID_KEY_2
    ) {
      setError(false);
      startHackSequence();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const startHackSequence = () => {
    setPhase('hacking');
    
    // Эффект подбора пароля (матрица)
    let iterations = 0;
    const interval = setInterval(() => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
      let randomStr = '';
      for(let i=0; i<12; i++) randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
      setGlitchText(randomStr);
      iterations++;
      
      if (iterations > 20) {
        clearInterval(interval);
        setGlitchText('МАГИЧЕСКИЙ СЛЕД ОБНАРУЖЕН');
        setTimeout(() => setPhase('magic'), 1500); // Переход в финал
      }
    }, 100);
  };

  return (
    <div className={styles.container}>
      
      {/* ФАЗА 1: Sci-Fi Ввод ключей */}
      {phase === 'auth' && (
        <div className={styles.authWrapper}>
          <div className={styles.scanline}></div>
          <h1 className={styles.title}>СИСТЕМА КРИПТОЗАЩИТЫ</h1>
          <p className={styles.subtitle}>Введите фрагменты кода для синхронизации артефактов.</p>
          
          <div className={styles.inputGroup}>
            <div className={styles.inputBox}>
              <label>ФРАГМЕНТ [АЛЬФА]</label>
              <input 
                type="text" 
                value={key1} 
                onChange={(e) => setKey1(e.target.value)}
                placeholder="Ввод..." 
                className={error ? styles.errorInput : ''}
              />
            </div>
            
            <div className={styles.inputBox}>
              <label>ФРАГМЕНТ [ОМЕГА]</label>
              <input 
                type="text" 
                value={key2} 
                onChange={(e) => setKey2(e.target.value)}
                placeholder="Ввод..."
                className={error ? styles.errorInput : ''}
              />
            </div>
          </div>

          {error && <div className={styles.errorMessage}>ОШИБКА: НЕСОВПАДЕНИЕ СИГНАТУР</div>}

          <button className={styles.verifyBtn} onClick={handleVerify}>
            [ ДЕШИФРОВАТЬ ]
          </button>
          
          <button className={styles.backBtn} onClick={onReturnToDashboard}>
            Отмена
          </button>
        </div>
      )}

      {/* ФАЗА 2: Глитч-взлом */}
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

      {/* ФАЗА 3: Магический Финал */}
      {phase === 'magic' && (
        <div className={styles.magicWrapper}>
          {/* Параллакс слои со звездами */}
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
              <p className={styles.highlightText}>
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
        
