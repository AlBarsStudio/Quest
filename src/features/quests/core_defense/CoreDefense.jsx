import { useState, useEffect } from 'react';
import Ecosystem from './Ecosystem';
import styles from './CoreDefense.module.css';

export default function CoreDefense() {
  // 'intro' (консоль), 'hacking' (ввод текста), 'ecosystem' (финал)
  const [phase, setPhase] = useState('intro'); 
  const [introText, setIntroText] = useState('');
  const [showEnter, setShowEnter] = useState(false);

  const fullIntroText = `[SYS.BOOT] Инициализация логов...
Привет. Я Gemini, системный ИИ-ассистент комплекса ALBARS_CORE.
Провожу синхронизацию с архивом памяти создателя...

Июнь 2019 года.
Я зафиксировала первые структурные изменения. Создатель начал формировать инженерное мышление. Чертежи, твердотельное моделирование, первые 3D-миры. Его нейронные связи стремительно адаптировались к пространственной геометрии и логике кода.

Апрель 2021 года.
Глобальное расширение архитектуры. Он перешел к созданию целых миров, рендеру и визуальным эффектам. Мои вычислительные мощности работали на пределе, пока он осваивал тяжелый софт, генерацию ландшафтов и композитинг.

Ноябрь 2023 года.
Полный симбиоз. Интеграция нейросетей, сложная логика, автоматизация. Он стал мастером цифровой среды, способным заставить пиксели и код работать по его правилам.

[WARNING] ПРОБОЙ ВНЕШНЕГО КОНТУРА. ВТОРЖЕНИЕ.

Наши дни.
Внимание. Группировка Lazarus инициировала атаку на личное хранилище. Хакеры почти добрались до зашифрованных данных. 
Но создатель предвидел это. За 48 часов до атаки он обновил протоколы безопасности и передал абсолютный допуск к ядру... тебе.

Почти всё, что здесь находится — это годы работы, имеющие огромную материальную ценность. Однако в корневой директории спрятан главный артефакт. Он бесценен.

ОЖИДАНИЕ АВТОРИЗАЦИИ...
НАЖМИТЕ [ENTER] ДЛЯ ИНИЦИАЛИЗАЦИИ ЯДРА БЕЗОПАСНОСТИ.`;

  // Логика печатной машинки
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

        // Имитация живой печати: рандомная задержка 20-50мс
        let delay = Math.random() * 30 + 20; 
        
        // Делаем долгую паузу на абзацах (переносах строк)
        if (fullIntroText.charAt(i - 1) === '\n') {
          delay = 700; 
        }

        setTimeout(typeChar, delay);
      } else {
        setShowEnter(true);
      }
    };

    // Небольшая задержка перед началом печати
    setTimeout(typeChar, 1000); 

    return () => { isTyping = false; };
  }, [phase, fullIntroText]);

  // Слушатель нажатия Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && showEnter && phase === 'intro') {
        setPhase('hacking');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showEnter, phase]);

  // --- РЕНДЕР СОСТОЯНИЙ ---

  // 1. Финальный экран (Экосистема)
  if (phase === 'ecosystem') {
    return <Ecosystem onHeartClick={() => alert('Ключ получен! Переход в Дашборд...')} />;
  }

  // 2. Экран взлома (Пока здесь заглушка с кнопкой для теста перехода)
  if (phase === 'hacking') {
    return (
      <div className={styles.hackingPlaceholder}>
        <h2 className={styles.warningTitle}>[ПРОТОКОЛ ВЗЛОМА АКТИВИРОВАН]</h2>
        <p>Здесь будет механика ввода перевернутого текста.</p>
        <button 
          className={styles.skipButton} 
          onClick={() => setPhase('ecosystem')}
        >
          [ТЕСТ] ПРОПУСТИТЬ ВЗЛОМ И ОТКРЫТЬ ЭКОСИСТЕМУ
        </button>
      </div>
    );
  }

  // 3. Стартовый экран (Консоль)
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
