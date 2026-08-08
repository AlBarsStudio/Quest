import { useState, useEffect } from 'react';
import HackingPhase from './HackingPhase';
import Ecosystem from './Ecosystem';
import styles from './CoreDefense.module.css';

export default function CoreDefense() {
  const [phase, setPhase] = useState('intro'); // 'intro', 'hacking', 'ecosystem', 'failed'
  const [introText, setIntroText] = useState('');
  const [showEnter, setShowEnter] = useState(false);
  const [hackResults, setHackResults] = useState(null); // Сюда запишем очки

  // ... (здесь остается текст fullIntroText из предыдущего шага, я его свернул для краткости) ...
  const fullIntroText = `[SYS.BOOT] Инициализация логов...\nПривет. Я Gemini, системный ИИ-ассистент комплекса ALBARS_CORE.\nПровожу синхронизацию с архивом памяти создателя...\n\nИюнь 2019 года.\nЯ зафиксировала первые структурные изменения. Создатель начал формировать инженерное мышление. Чертежи, твердотельное моделирование, первые 3D-миры. Его нейронные связи стремительно адаптировались к пространственной геометрии и логике кода.\n\nАпрель 2021 года.\nГлобальное расширение архитектуры. Он перешел к созданию целых миров, рендеру и визуальным эффектам. Мои вычислительные мощности работали на пределе, пока он осваивал тяжелый софт, генерацию ландшафтов и композитинг.\n\nНоябрь 2023 года.\nПолный симбиоз. Интеграция нейросетей, сложная логика, автоматизация. Он стал мастером цифровой среды, способным заставить пиксели и код работать по его правилам.\n\n[WARNING] ПРОБОЙ ВНЕШНЕГО КОНТУРА. ВТОРЖЕНИЕ.\n\nНаши дни.\nВнимание. Группировка Lazarus инициировала атаку на личное хранилище. Хакеры почти добрались до зашифрованных данных. \nНо создатель предвидел это. За 48 часов до атаки он обновил протоколы безопасности и передал абсолютный допуск к ядру... тебе.\n\nПочти всё, что здесь находится — это годы работы, имеющие огромную материальную ценность. Однако в корневой директории спрятан главный артефакт. Он бесценен.\n\nОЖИДАНИЕ АВТОРИЗАЦИИ...\nНАЖМИТЕ [ENTER] ДЛЯ ИНИЦИАЛИЗАЦИИ ЯДРА БЕЗОПАСНОСТИ.`;

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
        let delay = Math.random() * 30 + 10; 
        if (fullIntroText.charAt(i - 1) === '\n') delay = 500; 
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

  // Обработчик завершения взлома
  const handleHackComplete = (results) => {
    setHackResults(results);
    if (results.success) {
      setPhase('ecosystem');
    } else {
      setPhase('failed');
    }
  };

  // --- РЕНДЕР ---

  if (phase === 'ecosystem') {
    // Передаем результаты в Ecosystem, если захочешь показать медаль (можно добавить позже)
    return <Ecosystem onHeartClick={() => alert('Ключ получен! Переход в Дашборд...')} results={hackResults} />;
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
