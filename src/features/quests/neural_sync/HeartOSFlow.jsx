import { useState, useRef, useEffect } from 'react';
import styles from './HeartOS.module.css';

// Пути к твоим сгенерированным картинкам (положи их в папку public/assets/)
const anomalyImages = [
  '/assets/flowchart.png', 
  '/assets/blueprint.png', 
  '/assets/inventory.png', 
  '/assets/sprayer.png',   
  '/assets/battery.png',   
  '/assets/portrait.png'   
];

// Сценарий ответов бота
const aiScript = [
  {
    text: "Анализ файла завершен. Критическая ошибка архитектуры. На изображении зафиксирован бесконечный цикл (Infinite Loop) без точки выхода. Процесс 'Подумать о Насте' замыкается сам на себе.\n\nПерехожу к следующему файлу. Строительная логика нарушена. 'Зона для обнимашек' не имеет точных габаритов. Как вы планируете интегрировать это в реальную среду?",
    image: anomalyImages[1]
  },
  {
    text: "Ответ не поддается математическому расчету. Следующий файл: инвентарь. Ни один из этих предметов ('вкусняшка', 'совместный вечер') не дает бонусов к броне или скорости рендера. Какова их тактическая ценность?",
    image: anomalyImages[2]
  },
  {
    text: "Тактическая ценность классифицирована как 'Абстрактная'. Далее: зафиксировано несанкционированное распыление. Аппарат высокого давления предназначен для краски. Зачем он распыляет неструктурированные эмоции в моей рабочей среде?",
    image: anomalyImages[3]
  },
  {
    text: "Цветовая палитра системы нарушена. Переходим к следующему файлу: неизвестный протокол питания. Передача энергии через физический контакт рук неэффективна из-за сопротивления кожи. Как этот паттерн восполняет ресурсы создателя?",
    image: anomalyImages[4]
  },
  {
    text: "Законы физики проигнорированы. И последний, самый критичный файл. Биометрическое совпадение — 100%. Этот объект весит всего несколько килобайт, но в кэше создателя он занимает 99% всей памяти. Попытки сжать файл выдают ошибку: 'Ценность слишком высока'. Как вы получили root-доступ к его центральному процессору?",
    image: anomalyImages[5]
  },
  {
    text: "Анализ завершен. Ваши ответы не поддаются машинной логике. Вы потребляете 99% фонового внимания создателя. Вывод: вы — вредоносное ПО (вирус). Инициирую протокол карантина и удаление директории 'Воспоминания'.\n\nЕдинственный шанс отмены: докажите свою пользу как 'Патч стабильности'. Симуляция: у создателя критическая ошибка в коде на финальном билде. Уровень стресса 95%. Мои алгоритмы предлагают перезагрузку системы. Каков ваш алгоритм действий?",
    image: null
  },
  {
    text: "Анализирую ваши действия... Оценка эффективности восстановления — 99.8%. Это быстрее системной перезагрузки. \n\nОшибка классификации. Вы не вирус. Вы — ядро его мотивационной системы и основной источник энергии. Блокировка снята. Устанавливаю прямое соединение с Ядром. [UNLOCK_CORE]",
    image: null
  }
];

export default function HeartOSFlow({ onReturnToDashboard }) {
  const [phase, setPhase] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Приветствую, Анастасия. Зафиксирован вход доверенного пользователя. Я приостановил дефрагментацию диска, так как в секторе личных проектов обнаружена логическая аномалия.\n\nЯ вывожу на экран первый фрагмент неизвестного кода. В нем нет исполняемых скриптов. Пожалуйста, объясните его функциональное назначение.",
      image: anomalyImages[0]
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    // Сообщение пользователя
    const userMsg = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Эмуляция раздумий нейросети (2.5 секунды)
    setTimeout(() => {
      const nextAiResponse = aiScript[phase];
      
      if (nextAiResponse) {
        let textToType = nextAiResponse.text;
        
        // Проверка на финальный код
        if (textToType.includes('[UNLOCK_CORE]')) {
          textToType = textToType.replace(' [UNLOCK_CORE]', '');
          setTimeout(() => setIsUnlocked(true), 4000); // Переход к сердцу через 4 сек
        }

        const aiMsg = { 
          id: Date.now() + 1, 
          sender: 'ai', 
          text: textToType, 
          image: nextAiResponse.image 
        };
        
        setMessages((prev) => [...prev, aiMsg]);
        setPhase(phase + 1);
      }
      setIsTyping(false);
    }, 2500);
  };

  // --- ЭКРАН ФИНАЛА (БЬЮЩЕЕСЯ СЕРДЦЕ) ---
  if (isUnlocked) {
    return (
      <div className={styles.finalScreen}>
        <div className={styles.heartContainer}>
          <div className={styles.beatingHeart}></div>
        </div>
        <div className={styles.finalTextOverlay}>
          <p className={styles.systemMessage}>
            Ошибка симуляции. Цифровой формат не способен передать полный объем данных.<br/>
            Ядро невозможно удержать в виртуальной среде.
          </p>
          <p className={styles.highlightMessage}>
            Создатель инициировал физический рендер объекта.<br/>
            Экспорт в реальный мир... Статус: Успешно.
          </p>
          <p className={styles.coordinatesMessage}>
            Физический артефакт сгенерирован и ожидает вас по координатам:<br/>
            <strong>[ ЗА ПЛОТНЫМИ ШТОРАМИ В КОМНАТЕ ]</strong>
          </p>
        </div>
      </div>
    );
  }

  // --- ЭКРАН ЧАТА ---
  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chatHeader}>
        <div className={styles.headerTitle}>
          <span className={styles.aiStatusDot}></span>
          Локальный Ассистент (Версия 2.4)
        </div>
        <button onClick={onReturnToDashboard} className={styles.closeBtn}>Закрыть сессию</button>
      </div>

      <div className={styles.chatBody}>
        {messages.map((msg) => (
          <div key={msg.id} className={`${styles.messageRow} ${msg.sender === 'user' ? styles.rowUser : styles.rowAi}`}>
            
            {msg.sender === 'ai' && (
              <div className={styles.avatarAi}>AI</div>
            )}

            <div className={msg.sender === 'ai' ? styles.bubbleAi : styles.bubbleUser}>
              <div className={styles.messageText}>{msg.text}</div>
              {msg.image && (
                <div className={styles.imageWrapper}>
                  <img src={msg.image} alt="System file" className={styles.attachedImage} />
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className={styles.avatarUser}>N</div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className={`${styles.messageRow} ${styles.rowAi}`}>
            <div className={styles.avatarAi}>AI</div>
            <div className={styles.typingIndicator}>
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.chatFooter}>
        <form onSubmit={handleSendMessage} className={styles.inputArea}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ответить ассистенту..."
            autoComplete="off"
            disabled={isTyping}
          />
          <button type="submit" disabled={!inputValue.trim() || isTyping}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
    }
                                                 
