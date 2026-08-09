import { useState, useEffect } from 'react';
import HackingPhase from './HackingPhase';
import Ecosystem from './Ecosystem';
import styles from './CoreDefense.module.css';

export default function CoreDefense({ onReturnToDashboard }) {
  const [phase, setPhase] = useState('intro');
  const [introText, setIntroText] = useState('');
  const [showEnter, setShowEnter] = useState(false);
  const [hackResults, setHackResults] = useState(null); 

  // Новый атмосферный текст с историей
  const fullIntroText = `> [SYS.BOOT] ИНИЦИАЛИЗАЦИЯ ТЕРМИНАЛА...
> ПОДКЛЮЧЕНИЕ К СЕРВЕРУ "ALBARS_CORE"... [ОК]
> СИНХРОНИЗАЦИЯ БАЗЫ ДАННЫХ...

> АНАЛИЗ ПАМЯТИ: 
> ЗАПИСЬ ОТ 09.06.2026: ОБНАРУЖЕНА НОВАЯ ПЕРЕМЕННАЯ "ANASTASIA". СИСТЕМА ДАЛА СБОЙ ОТ ПЕРЕИЗБЫТКА ЭМОЦИЙ.
> ЗАПИСЬ ОТ 23.06.2026: УСТАНОВЛЕНО ПОСТОЯННОЕ СОЕДИНЕНИЕ. ЯДРО ПЕРЕСТРОЕНО ПОД ОДНОГО ПОЛЬЗОВАТЕЛЯ.

> [WARNING] КРИТИЧЕСКАЯ УГРОЗА! ВНЕШНИЙ КОНТУР ПРОБИТ.
> Вредоносные алгоритмы пытаются стереть данные.
> Но я оставил бэкдор для единственного человека, способного остановить хаос.

> ОЖИДАНИЕ РУЧНОГО ВВОДА ОПЕРАТОРА "НАСТЯ"...
> НАЖМИТЕ [ENTER] ДЛЯ ПЕРЕХОДА К ПРОТОКОЛУ ЗАЩИТЫ.`;

  useEffect(() => {
    if (phase !== 'intro') return;
    
    let currentText = '';
    let i = 0;
    let isTyping = true;
    
    const typeChar = () => {
      if (!isTyping) return;
      
      if (i < fullIntroText.length) {
        currentText += fullIntroText.charAt(i);
        setIntroText(currentText);
        i++;
        
        // Сделал скорость набора приятной для чтения
        let delay = Math.random() * 20 + 20; 
        if (fullIntroText.charAt(i - 1) === '\n') delay = 400; // Пауза на абзацах
        
        setTimeout(typeChar, delay);
      } else {
        setShowEnter(true);
      }
    };
    
    setTimeout(typeChar, 500); 
    return () => { isTyping = false; };
  }, [phase]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && showEnter && phase === 'intro') {
        setPhase('hacking');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showEnter, phase]);

  const handleHackComplete = (results) => {
    setHackResults(results);
    if (results.success) {
      setPhase('ecosystem');
    } else {
      setPhase('failed');
    }
  };

  if (phase === 'ecosystem') {
    return <Ecosystem onHeartClick={onReturnToDashboard} results={hackResults} />;
  }

  if (phase === 'hacking') {
    return <HackingPhase onComplete={handleHackComplete} />;
  }

  if (phase === 'failed') {
    return (
      <div className={styles.terminalContainer}>
        <div className={styles.terminalContent} style={{ color: 'red', textAlign: 'center', borderColor: 'red' }}>
          <h2>[ КРИТИЧЕСКАЯ ОШИБКА ]</h2>
          <p>ВРЕМЯ ИСТЕКЛО. ДАННЫЕ ЗАШИФРОВАНЫ.</p>
          <p>Ядро дестабилизировано.</p>
          <button 
            style={{marginTop: '30px', padding: '10px 20px', background: 'transparent', color: 'red', border: '1px solid red', cursor: 'pointer'}}
            onClick={() => setPhase('hacking')}
          >
            ПОВТОРИТЬ ПОПЫТКУ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.terminalContainer}>
      <div className={styles.crtOverlay}></div>
      <div className={styles.terminalContent}>
        <pre className={styles.typewriterText}>
          {introText}
          <span className={styles.cursor}>_</span>
        </pre>
      </div>
    </div>
  );
}
