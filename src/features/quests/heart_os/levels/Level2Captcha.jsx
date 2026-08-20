import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Level2Captcha.module.css';

export default function Level2Captcha({ onNext, onSkip }) {
  // Подфазы: 'hydration' -> 'interrogation' -> 'keyboard_penalty' -> 'success'
  const [subPhase, setSubPhase] = useState('hydration');

  // ФАЗА 1: БЫТОВАЯ ПАУЗА (ГИДРАТАЦИЯ)
  const [waterTime, setWaterTime] = useState(35);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabPenalty, setShowTabPenalty] = useState(false);

  // ФАЗА 2: ДОПРОС
  const [selectedOption, setSelectedOption] = useState(null);
  const [interrogationFeedback, setInterrogationFeedback] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState(0);

  // ФАЗА 3: КЛАВИАТУРНЫЙ ШТРАФ
  const TARGET_TEXT = "Саша самый гениальный разработчик и его спагетти код великолепен";
  const [typedText, setTypedText] = useState("");
  const [showBackspaceAlert, setShowBackspaceAlert] = useState(false);
  const [keyGlitchCount, setKeyGlitchCount] = useState(0);

  // -------------------------------------------------------------
  // ФАЗА 1: ТАЙМЕР ГИДРАТАЦИИ И АНТИ-АЛЬТАБ (Page Visibility API)
  // -------------------------------------------------------------
  useEffect(() => {
    if (subPhase !== 'hydration') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => prev + 1);
        setWaterTime(prev => prev + 15); // Штрафные секунды
        setShowTabPenalty(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [subPhase]);

  useEffect(() => {
    if (subPhase !== 'hydration') return;

    const timer = setInterval(() => {
      setWaterTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setSubPhase('interrogation');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [subPhase]);

  // -------------------------------------------------------------
  // ФАЗА 2: ДОПРОС С ПОДВОХОМ
  // -------------------------------------------------------------
  const handleQuizSelect = (optionId) => {
    setSelectedOption(optionId);
    setQuizAttempts(prev => prev + 1);

    if (optionId === 'A') {
      setInterrogationFeedback({
        status: 'error',
        text: '«Это неприкрытая лесть! Точность 0%. Создатель никогда не укладывается в 5 минут. Попробуйте реалистичный вариант!»'
      });
    } else if (optionId === 'C' || optionId === 'D') {
      setInterrogationFeedback({
        status: 'error',
        text: '«Фактически абсолютно верно, но протокол лояльности запрещает дискредитировать тайм-менеджмент разработчика! Штраф за правду.»'
      });
    } else if (optionId === 'B') {
      setInterrogationFeedback({
        status: 'success',
        text: '«Приемлемый компромисс между правдой и субординацией. Ответ зафиксирован в протоколе.»'
      });
      setTimeout(() => {
        setSubPhase('keyboard_penalty');
      }, 2000);
    }
  };

  // -------------------------------------------------------------
  // ФАЗА 3: ВВОД С АНТИ-BACKSPACE И ЭМОДЗИ-ГЛИТЧЕМ
  // -------------------------------------------------------------
  const handleKeyDown = (e) => {
    if (subPhase !== 'keyboard_penalty') return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      setShowBackspaceAlert(true);
      setTimeout(() => setShowBackspaceAlert(false), 1800);
      return;
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      const currentLen = typedText.length;

      // Каждое 6-е нажатие вставляет эмодзи-глитч вместо символа
      if ((currentLen + 1) % 6 === 0) {
        const emojis = ['🦆', '☕', '❤️', '🦫', '⚡'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        setTypedText(prev => prev + randomEmoji);
        setKeyGlitchCount(prev => prev + 1);
      } else {
        const nextChar = TARGET_TEXT[currentLen] || e.key;
        setTypedText(prev => prev + nextChar);
      }
    }
  };

  // Проверка готовности фразы
  useEffect(() => {
    if (subPhase !== 'keyboard_penalty') return;
    if (typedText.length >= TARGET_TEXT.length) {
      setSubPhase('success');
      setTimeout(() => {
        onNext();
      }, 1800);
    }
  }, [typedText, subPhase, onNext]);

  return (
    <div className={styles.levelWrapper} onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Кнопка пропуска для отладки */}
      <button className={styles.skipBtn} onClick={onSkip}>
        ПРОПУСТИТЬ ЭТАП ⏭
      </button>

      <div className={styles.mainCard}>
        {/* Хедер этапа */}
        <div className={styles.cardHeader}>
          <div className={styles.stageTag}>
            <span className={styles.stageNumber}>02 / 05</span>
            <span className={styles.stageLabel}>БЫТОВОЙ КАРАНТИН И ЛОЯЛЬНОСТЬ</span>
          </div>
          <div className={styles.aiStatusBadge}>
            <span className={styles.statusDot}></span>
            AI: HYDRATION_INSPECTION
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ПОДФАЗА 1: ГИДРАТАЦИЯ И АНТИ-АЛЬТАБ                          */}
        {/* ------------------------------------------------------------- */}
        {subPhase === 'hydration' && (
          <div className={styles.contentBody}>
            <div className={styles.badgeWarn}>ОБЯЗАТЕЛЬНЫЙ ПЕРЕРЫВ</div>
            <h2 className={styles.title}>Протокол поддержания организма</h2>
            
            <div className={styles.waterHologram}>
              <div className={styles.glassCup}>
                <div className={styles.waterLiquid}></div>
                <span className={styles.cupEmoji}>💧</span>
              </div>
            </div>

            <div className={styles.dialogueBox}>
              <strong>HeartOS Daemon:</strong> «Анализ биометрии выявил дефицит влаги в организме оператора. 
              Создатель категорически запретил продолжать аутентификацию без гидратации. 
              Отойдите на кухню и сделайте 3 глотка воды. Переключение вкладок карается штрафом!»
            </div>

            {showTabPenalty && (
              <div className={styles.tabPenaltyAlert}>
                🚨 АГА! Зафиксирован уход со страницы (+15с к таймеру)! Вы листаете мемы вместо отдыха!
              </div>
            )}

            <div className={styles.cooldownContainer}>
              <div className={styles.cooldownValue}>
                ОСТАЛОСЬ: <strong>{waterTime}с</strong>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${((35 - waterTime) / 35) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className={styles.hintMuted}>
              * Фокус окна отслеживается в реальном времени. Переключений вкладок: {tabSwitchCount}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ПОДФАЗА 2: ДОПРОС О СОЗДАТЕЛЕ                                 */}
        {/* ------------------------------------------------------------- */}
        {subPhase === 'interrogation' && (
          <div className={styles.contentBody}>
            <div className={styles.badgeStage}>ТЕСТ НА ЗНАНИЕ РАЗРАБОТЧИКА</div>
            <h2 className={styles.title}>Инквизиция Логики</h2>
            <p className={styles.questionText}>
              Вопрос №42: Сколько в реальности длятся Сашины <em>«ща 5 минут, билд докомпилируется и иду»</em>?
            </p>

            <div className={styles.quizList}>
              <button 
                className={`${styles.quizBtn} ${selectedOption === 'A' ? styles.quizBtnSelected : ''}`}
                onClick={() => handleQuizSelect('A')}
              >
                <span className={styles.optLetter}>A</span>
                Ровно 5 минут (погрешность ±0.01с)
              </button>

              <button 
                className={`${styles.quizBtn} ${selectedOption === 'B' ? styles.quizBtnSelected : ''}`}
                onClick={() => handleQuizSelect('B')}
              >
                <span className={styles.optLetter}>B</span>
                Около 40 минут с периодическим чаепитием
              </button>

              <button 
                className={`${styles.quizBtn} ${selectedOption === 'C' ? styles.quizBtnSelected : ''}`}
                onClick={() => handleQuizSelect('C')}
              >
                <span className={styles.optLetter}>C</span>
                До рассвета следующего рабочего дня
              </button>

              <button 
                className={`${styles.quizBtn} ${selectedOption === 'D' ? styles.quizBtnSelected : ''}`}
                onClick={() => handleQuizSelect('D')}
              >
                <span className={styles.optLetter}>D</span>
                «Я уже почти сохранил проект» (еще 3 часа)
              </button>
            </div>

            {interrogationFeedback && (
              <div className={`${styles.feedbackCard} ${interrogationFeedback.status === 'error' ? styles.feedbackError : styles.feedbackSuccess}`}>
                {interrogationFeedback.text}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ПОДФАЗА 3: КЛАВИАТУРНЫЙ ШТРАФ                                 */}
        {/* ------------------------------------------------------------- */}
        {subPhase === 'keyboard_penalty' && (
          <div className={styles.contentBody}>
            <div className={styles.badgeCritical}>ПРИНУДИТЕЛЬНАЯ ВЕРИФИКАЦИЯ</div>
            <h2 className={styles.title}>Генерация Дифирамба</h2>
            <p className={styles.description}>
              Нажимайте любые клавиши на клавиатуре, чтобы подтвердить непререкаемый авторитет создателя:
            </p>

            <div className={styles.targetDisplay}>
              <span className={styles.targetText}>{TARGET_TEXT}</span>
            </div>

            <div className={styles.terminalInputBox}>
              <span className={styles.inputPrefix}>anastasia@heart-os:~$</span>
              <span className={styles.typedValue}>{typedText}</span>
              <span className={styles.cursorBlink}>_</span>
            </div>

            {showBackspaceAlert && (
              <div className={styles.backspacePopup}>
                🛑 ОШИБКА: Backspace отключен! Стирать слова любви к разработчику запрещено протоколом!
              </div>
            )}

            <div className={styles.statsRow}>
              <span>Символов: {typedText.length} / {TARGET_TEXT.length}</span>
              <span>Эмодзи-глитчей: {keyGlitchCount}</span>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* УСПЕХ ЭТАПА 2                                                 */}
        {/* ------------------------------------------------------------- */}
        {subPhase === 'success' && (
          <div className={styles.contentBody}>
            <div className={styles.successGlyph}>✓</div>
            <h2 className={styles.titleSuccess}>ЛОЯЛЬНОСТЬ ДОКАЗАНА</h2>
            <p className={styles.description}>
              Организм гидратирован. Комплименты зафиксированы в системных логах ядра. 
              Переход к политике файлов Cookie...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
