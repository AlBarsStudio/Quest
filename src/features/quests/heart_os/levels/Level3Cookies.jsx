import { useState, useEffect, useRef } from 'react';
import styles from './Level3Cookies.module.css';

// База параметров GDPR с взаимными исключениями
const TOGGLE_CATEGORIES = {
  lifestyle: {
    title: 'Бытовые Контуры',
    items: [
      { id: 'tea_refill', label: 'Автоподача чая/кофе при написании кода', defaultVal: true },
      { id: 'fry_theft', label: 'Право воровать картошку фри из чужой тарелки', defaultVal: true },
      { id: 'cat_priority', label: 'Уступать коту 80% спального места', defaultVal: false },
      { id: 'sleep_schedule', label: 'Соблюдение режима сна (Ложиться до 04:00)', defaultVal: false }
    ]
  },
  emotions: {
    title: 'Эмоциональные Протоколы',
    items: [
      { id: 'hugs_unlimited', label: 'Круглосуточный доступ к объятиям (24/7)', defaultVal: true },
      { id: 'personal_space', label: 'Строгое сохранение личного пространства', defaultVal: false },
      { id: 'night_memes', label: 'Отправка абсурдных мемов в 03:30 ночи', defaultVal: true },
      { id: 'drama_filter', label: 'Фильтрация капризов при голоде оператора', defaultVal: false }
    ]
  },
  system: {
    title: 'Системные Ресурсы',
    items: [
      { id: 'broadband_channel', label: 'Выделенный канал 10 Гбит/с для сериалов', defaultVal: false },
      { id: 'gpu_mining_love', label: 'Выделение 99% GPU на фоновый рендер чувств', defaultVal: true },
      { id: 'ai_paranoia', label: 'Режим тотальной подозрительности ассистента', defaultVal: true },
      { id: 'capybara_shield', label: 'Антивирусный экран боевых капибар', defaultVal: true }
    ]
  },
  root: {
    title: 'Root-Авторизация',
    items: [
      { id: 'root_anastasia', label: 'Присвоить Анастасии статус «Абсолютный Хозяин Ядра»', defaultVal: false },
      { id: 'guest_lock', label: 'Заблокировать доступ к сердцу гостевым аккаунтам', defaultVal: true },
      { id: 'auto_forgive', label: 'Автоматическое прощение невымытой кружки', defaultVal: false }
    ]
  }
};

export default function Level3Cookies({ onNext, onSkip }) {
  // Подфазы: 'toggles' -> 'legal_scroll' -> 'slider_hold' -> 'success'
  const [subPhase, setSubPhase] = useState('toggles');
  const [activeTab, setActiveTab] = useState('lifestyle');

  // Состояние всех чекбоксов
  const [toggles, setToggles] = useState(() => {
    const initial = {};
    Object.values(TOGGLE_CATEGORIES).forEach(cat => {
      cat.items.forEach(item => {
        initial[item.id] = item.defaultVal;
      });
    });
    return initial;
  });

  const [toggleError, setToggleError] = useState('');

  // Фаза 2: Скролл текста и поиск микро-ссылки
  const scrollContainerRef = useRef(null);
  const [hasScrolledDeep, setHasScrolledDeep] = useState(false);

  // Фаза 3: Адский слайдер с физикой
  const [sliderValue, setSliderValue] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 100%
  const [sliderAlert, setSliderAlert] = useState('');
  const sliderRef = useRef(null);

  // Переключение тумблеров
  const handleToggle = (id) => {
    setToggleError('');
    setToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Валидация логических конфликтов перед переходом к соглашению
  const handleValidateToggles = () => {
    // Конфликт 1: Объятия и личное пространство
    if (toggles['hugs_unlimited'] && toggles['personal_space']) {
      setToggleError('ОШИБКА 301: Парадокс! «Объятия 24/7» и «Личное пространство» взаимно аннигилируют процессор!');
      return;
    }
    // Конфликт 2: Мемы ночью требуют широкий канал
    if (toggles['night_memes'] && !toggles['broadband_channel']) {
      setToggleError('ОШИБКА 302: Для ночных мемов требуется включить «Выделенный канал 10 Гбит/с» во вкладке [Системные Ресурсы]!');
      return;
    }
    // Конфликт 3: Обязательный Root
    if (!toggles['root_anastasia']) {
      setToggleError('ОТКАЗ: Вы не активировали статус «Абсолютный Хозяин Ядра» во вкладке [Root-Авторизация]!');
      return;
    }
    // Конфликт 4: Паранойю нужно отключить
    if (toggles['ai_paranoia']) {
      setToggleError('ОШИБКА: Защитный демон отказывается передать контроль, пока включен «Режим паранойи ассистента»!');
      return;
    }

    // Все проверки пройдены
    setToggleError('');
    setSubPhase('legal_scroll');
  };

  // Проверка скролла соглашения
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight * 0.4) {
      setHasScrolledDeep(true);
    }
  };

  const handleSecretLinkClick = () => {
    setSubPhase('slider_hold');
  };

  // -------------------------------------------------------------
  // ЛОГИКА АДСКОГО СЛАЙДЕРА С ОТДАЧЕЙ (Удержать ровно 93% 3.5 секунды)
  // -------------------------------------------------------------
  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    setSliderValue(val);

    if (val === 100) {
      setSliderAlert('«100% — ЭТО ФАНАТИЗМ! Человек всегда сомневается. Вы бот!» (Сброс в 0%)');
      setSliderValue(0);
      setHoldProgress(0);
      return;
    }

    if (val >= 92 && val <= 94) {
      setSliderAlert('ИДЕАЛЬНЫЙ БАЛАНС! ДЕРЖИТЕ ПОЛЗУНОК!');
    } else {
      setSliderAlert(val < 92 ? 'Слишком мало доверия...' : 'Опасная зона перегрева (>94%)!');
      setHoldProgress(0);
    }
  };

  // Таймер удержания ползунка в диапазоне 92-94%
  useEffect(() => {
    if (subPhase !== 'slider_hold') return;

    let interval = null;
    const inTargetRange = sliderValue >= 92 && sliderValue <= 94;

    if (isHolding && inTargetRange) {
      interval = setInterval(() => {
        setHoldProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setSubPhase('success');
            setTimeout(() => onNext(), 1800);
            return 100;
          }
          return prev + 3; // ~3.3 секунды
        });
      }, 100);
    } else if (!isHolding && sliderValue > 0) {
      // Пружинный откат ползунка вниз при отпускании
      const decay = setInterval(() => {
        setSliderValue(prev => {
          if (prev <= 0) {
            clearInterval(decay);
            return 0;
          }
          return Math.max(0, prev - 4);
        });
        setHoldProgress(0);
      }, 30);
      return () => clearInterval(decay);
    }

    return () => clearInterval(interval);
  }, [isHolding, sliderValue, subPhase, onNext]);

  return (
    <div className={styles.levelWrapper}>
      {/* Кнопка пропуска для отладки */}
      <button className={styles.skipBtn} onClick={onSkip}>
        ПРОПУСТИТЬ ЭТАП ⏭
      </button>

      <div className={styles.mainCard}>
        {/* Хедер этапа */}
        <div className={styles.cardHeader}>
          <div className={styles.stageTag}>
            <span className={styles.stageNumber}>03 / 05</span>
            <span className={styles.stageLabel}>БЮРОКРАТИЧЕСКИЙ ЛАБИРИНТ GDPR</span>
          </div>
          <div className={styles.aiStatusBadge}>
            <span className={styles.statusDot}></span>
            AI: REGULATION_HELL
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ПОДФАЗА 1: КОНФЛИКТУЮЩИЕ НАСТРОЙКИ                           */}
        {/* ------------------------------------------------------------- */}
        {subPhase === 'toggles' && (
          <div className={styles.contentBody}>
            <div className={styles.badgeWarn}>КОНФИГУРАТОР СОГЛАСИЙ</div>
            <h2 className={styles.title}>Управление Cookie и Чувствами</h2>
            <p className={styles.description}>
              Сформируйте бесконфликтную конфигурацию прав. 
              Система не пропустит настройки с логическими противоречиями!
            </p>

            {/* Навигация по вкладкам */}
            <div className={styles.tabsRow}>
              {Object.entries(TOGGLE_CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  className={`${styles.tabBtn} ${activeTab === key ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            {/* Список тумблеров текущей вкладки */}
            <div className={styles.togglesContainer}>
              {TOGGLE_CATEGORIES[activeTab].items.map(item => (
                <div 
                  key={item.id} 
                  className={`${styles.toggleRow} ${toggles[item.id] ? styles.toggleRowActive : ''}`}
                  onClick={() => handleToggle(item.id)}
                >
                  <div className={styles.toggleTextGroup}>
                    <span className={styles.toggleLabel}>{item.label}</span>
                    <span className={styles.toggleId}>ID: sys.param.{item.id}</span>
                  </div>

                  <div className={`${styles.switchTrack} ${toggles[item.id] ? styles.switchOn : ''}`}>
                    <div className={styles.switchThumb}></div>
                  </div>
                </div>
              ))}
            </div>

            {toggleError && (
              <div className={styles.toggleErrorAlert}>
                ⚠️ {toggleError}
              </div>
            )}

            <button className={styles.submitTogglesBtn} onClick={handleValidateToggles}>
              ПОДТВЕРДИТЬ КОНФИГУРАЦИЮ ➔
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ПОДФАЗА 2: БЕСКОНЕЧНЫЙ ТЕКСТ СОГЛАШЕНИЯ                      */}
        {/* ------------------------------------------------------------- */}
        {subPhase === 'legal_scroll' && (
          <div className={styles.contentBody}>
            <div className={styles.badgeCritical}>ПАРАГРАФ 404-B</div>
            <h2 className={styles.title}>Пользовательское Соглашение</h2>
            <p className={styles.description}>
              Внимательно изучите текст регламента и подтвердите согласие личной подписью.
            </p>

            <div 
              className={styles.legalScrollBox} 
              ref={scrollContainerRef}
              onScroll={handleScroll}
            >
              <p><strong>1.1. Общие положения.</strong> Настоящий протокол регулирует порядок передачи исходного кода сердца от Разработчика (Александра) к Главнокомандующему Пушистого Спецназа (Анастасии).</p>
              <p><strong>1.2. Обязанности сторон.</strong> Оператор обязуется не применять эмоциональный DDoS-атаку в моменты компиляции шейдеров Unreal Engine 5. В случае критического бага допускается использование боевых капибар.</p>
              <p><strong>2.1. Регламент картошки фри.</strong> Вся картошка фри, заказанная Разработчиком со словами «я не голодна», автоматически признается общим неделимым кластером памяти.</p>
              <p><strong>2.2. Защита от холодных лапок.</strong> Оператор имеет право греть замерзшие ступни о спину Создателя исключительно в диапазоне с 22:00 до 08:00 по местному времени.</p>
              <p><strong>3.1. Гарантийные обязательства.</strong> Любовь предоставляется «как есть» (AS-IS), с пожизненной гарантией, бесконечным числом обновлений и нулевой вероятностью отката на предыдущие версии.</p>
              <p>
                <strong>3.2. Особые системные условия.</strong> Чтобы подтвердить дееспособность и закрыть данный бюрократический ад, оператор должен найти эту строчку и 
                <span className={styles.secretTextLink} onClick={handleSecretLinkClick}>
                  {' '}<u>нажать прямо на этот скрытый фрагмент текста</u>{' '}
                </span>
                для разблокировки финального регулятора согласия.
              </p>
              <p><strong>4.1. Форс-мажор.</strong> Падение серверов, разряженный телефон или внезапный просмотр 10 серий турецкого сериала подряд не являются основанием для прекращения объятий.</p>
              <p><strong>5.0. Заключение.</strong> Принятие данных условий необратимо и закреплено криптографическим хэшем в базе данных AlBars Core.</p>
            </div>

            <div className={styles.legalHint}>
              {hasScrolledDeep 
                ? '💡 Подсказка: Внимательно читайте пункт 3.2 соглашения!' 
                : '↓ Пролистайте текст вниз, чтобы ознакомиться со всеми пунктами.'}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ПОДФАЗА 3: АДСКИЙ СЛАЙДЕР С ГРАВИТАЦИЕЙ И УДЕРЖАНИЕМ        */}
        {/* ------------------------------------------------------------- */}
        {subPhase === 'slider_hold' && (
          <div className={styles.contentBody}>
            <div className={styles.badgeStage}>ТОЧНАЯ КАЛИБРОВКА</div>
            <h2 className={styles.title}>Степень Искренности</h2>
            <p className={styles.description}>
              Зажмите и удерживайте ползунок ровно на отметке <strong>93%</strong> в течение 3.5 секунд. 
              При отпускании мыши значение соскальзывает вниз!
            </p>

            <div className={styles.sliderControlContainer}>
              <div className={styles.sliderReadout}>
                ТЕКУЩИЙ УРОВЕНЬ: <span className={styles.readoutNum}>{sliderValue}%</span>
              </div>

              <div className={styles.sliderTrackWrapper}>
                {/* Отметка целевой зоны 92-94% */}
                <div className={styles.targetZoneMarker} style={{ left: '92%', width: '3%' }}></div>

                <input 
                  ref={sliderRef}
                  type="range"
                  min="0"
                  max="100"
                  value={sliderValue}
                  onChange={handleSliderChange}
                  onMouseDown={() => setIsHolding(true)}
                  onMouseUp={() => setIsHolding(false)}
                  onTouchStart={() => setIsHolding(true)}
                  onTouchEnd={() => setIsHolding(false)}
                  className={`${styles.physicsSlider} ${isHolding ? styles.sliderActive : ''}`}
                />
              </div>

              <div className={styles.targetLegend}>
                <span>0% (Холод)</span>
                <span className={styles.targetMarkLabel}>🎯 ЦЕЛЬ: 93%</span>
                <span>100% (Бот-ловушка)</span>
              </div>

              {sliderAlert && (
                <div className={styles.sliderAlertBox}>
                  {sliderAlert}
                </div>
              )}

              {/* Прогресс-бар удержания */}
              <div className={styles.holdProgressBlock}>
                <div className={styles.holdText}>
                  УДЕРЖАНИЕ СТАБИЛЬНОСТИ: <strong>{Math.floor(holdProgress)}%</strong>
                </div>
                <div className={styles.holdProgressBar}>
                  <div 
                    className={styles.holdProgressFill}
                    style={{ width: `${holdProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* УСПЕХ ЭТАПА 3                                                 */}
        {/* ------------------------------------------------------------- */}
        {subPhase === 'success' && (
          <div className={styles.contentBody}>
            <div className={styles.successGlyph}>✓</div>
            <h2 className={styles.titleSuccess}>РЕГЛАМЕНТ УТВЕРЖДЕН</h2>
            <p className={styles.description}>
              Все 32 параграфа бюрократического хаоса приняты. 
              Переход к протоколу генерации мастер-пароля...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
